import numpy as np
import pymc as pm # type: ignore
import json
from scipy.stats import norm

import pandas as pd
from pyei.data import Datasets # type: ignore    
from pyei.two_by_two import TwoByTwoEI # type: ignore
from pyei.r_by_c import RowByColumnEI # type: ignore
from pyei.io_utils import from_netcdf, to_netcdf # type: ignore

import matplotlib.pyplot as plt

# File path for the JSON file
DATA_FILE = './resources/south-carolina-precinct-info.json'

def calculate_pdf(x, mean, std_dev):
    """
    Uses the probabilty density function
    """
    return (1 / (np.sqrt(2 * np.pi) * std_dev)) * np.exp(-0.5 * ((x - mean) / std_dev) ** 2)

def load_precinct_data(file_path):
    """
    Load and parse the JSON file to extract precinct data.
    """
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)  # Load the entire JSON file
            
        # Access the first object in the array and extract "precincts"
        if isinstance(data, list) and len(data) > 0:
            precincts = data[0].get('precincts', [])
        else:
            precincts = []

        return precincts

    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return []
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return []

def preprocess_data(precincts):
    """
    Process each precinct and extract/transform the required data.
    """
    total_population = []
    hispanic_population = []
    asian_population = []
    white_population = []
    black_population = []
    republican_votes = []
    democratic_votes = []
    precinct_pop = []
    region_types = []
    low_income = []
    medium_income = []
    high_income = []

    # Extract the relevant data for each precinct
    for precinct in precincts:
        precinct_pop.append(precinct.get("GEOID"))
        total_population.append(precinct.get("total_population", 0))
        hispanic_population.append(precinct.get("hispanic", 0))
        asian_population.append(precinct.get("asian", 0)),
        white_population.append(precinct.get("white", 0)),
        black_population.append(precinct.get("black", 0)),
        republican_votes.append(precinct.get("2020_PRES_R", 0)),
        democratic_votes.append(precinct.get("2020_PRES_D", 0))
        region_types.append(precinct.get("region_type", "Unknown"))

        low_income_sum = sum([
            precinct.get("LESS_10K", 0), precinct.get("10K_15K", 0),
            precinct.get("15K_20K", 0), precinct.get("20K_25K", 0),
            precinct.get("25K_30K", 0), precinct.get("30K_35K", 0),
            precinct.get("35K_40K", 0), precinct.get("40K_45K", 0),
            precinct.get("45K_50K", 0)
        ])
        medium_income_sum = sum([
            precinct.get("50K_60K", 0), precinct.get("60K_75K", 0),
            precinct.get("75K_100K", 0)
        ])
        high_income_sum = sum([
            precinct.get("100K_125K", 0), precinct.get("125K_150K", 0),
            precinct.get("150K_200K", 0), precinct.get("200K_MORE", 0)
        ])

        low_income.append(low_income_sum)
        medium_income.append(medium_income_sum)
        high_income.append(high_income_sum)

    # Create a pandas DataFrame
    df = pd.DataFrame({
        "Precinct": precinct_pop,
        "Total_Population": total_population,
        "Hispanic": hispanic_population,
        "Asian": asian_population,
        "White": white_population,
        "Black": black_population,
        "Republican_Votes": republican_votes,
        "Democratic_Votes": democratic_votes,
        "Region_Type": region_types,
        "Low_Income": low_income,
        "Medium_Income": medium_income,
        "High_Income": high_income,
    })
    print(df)
    return df

def filter_data_by_column(df, column_name, value):
    """
    Filters the DataFrame by a specific column and value.
    """
    return df[df[column_name] == value]

def perform_2x2_ei(dataframe, candidate_column, demographic_group_name, population_column):
    """
    Perform a 2x2 ecological inference analysis using pyEI.
    """
    # Ensure the columns are in numpy arrays for pyEI
    total_population = np.array(dataframe["Total_Population"])
    demographic_population = np.array(dataframe[population_column])
    candidate_votes = np.array(dataframe[candidate_column])

    valid_indices = total_population > 0
    total_population = total_population[valid_indices]
    demographic_population = demographic_population[valid_indices]
    candidate_votes = candidate_votes[valid_indices]

    
    #Calculate group and vote fractions
    group_fractions = demographic_population / total_population 
    votes_fraction = np.column_stack((candidate_votes / total_population,)) # So far its republcan votes

    #Handles NaN or infinity values
    group_fractions = np.nan_to_num(group_fractions, nan=0.0, posinf=0.0, neginf=0.0)
    votes_fraction = np.nan_to_num(votes_fraction, nan=0.0, posinf=0.0, neginf=0.0)

    # Fit the model with the data
    ei_2by2 = TwoByTwoEI(model_name="king99", lmbda=0.5)
    ei_2by2.fit(
       group_fraction = group_fractions.astype(np.float32),
       votes_fraction = votes_fraction.astype(np.float32),
       precinct_pops = total_population.astype(np.float32),
       demographic_group_name = demographic_group_name,
    )

    return ei_2by2

def perform_ei_for_all_races(dataframe):
    """
    Perform EI analysis for all races in the dataset, including results for both
    Republican and Democratic candidates.
    """
    race_columns = {
        "Hispanic": "Hispanic",
        "Asian": "Asian",
        "White": "White",
        "Black": "Black",
    }

    results = {}
    for race, column in race_columns.items():
        print(f"Performing EI for {race}")

        # Perform EI for Republican
        republican_ei = perform_2x2_ei(
            dataframe=dataframe,
            demographic_group_name=race,
            population_column=column,
            candidate_column="Republican_Votes",
        )
        republican_results = create_ei_json(republican_ei, "Republican", race)

        # Perform EI for Democratic
        democratic_ei = perform_2x2_ei(
            dataframe=dataframe,
            demographic_group_name=race,
            population_column=column,
            candidate_column="Democratic_Votes",
        )
        democratic_results = create_ei_json(democratic_ei, "Democratic", race)

        # Merge results for the race
        results[race] = {**republican_results, **democratic_results}

    return results

#######################################################################################################################
def perform_grouped_ei(df, group_columns):
    """
    Perform EI analysis for each combination of income and region type.
    """
    results = {}
    
    for column in group_columns:
        unique_values = df[column].unique()
        
        for value in unique_values:
            subset = filter_data_by_column(df, column, value)
            
            if len(subset) > 0:  # Avoid empty groups
                print(f"Performing EI for {column} = {value}")
                
                ei_result = perform_2x2_ei(
                    dataframe=subset,
                    demographic_group_name=column,
                    population_column="Total_Population",
                    candidate_name="Republican",
                )
                results[f"{column}_{value}"] = create_ei_json(ei_result, column)
                
    return results

def create_ei_json(ei_result, candidate_name, demographic_group_name):
    """
    Create a JSON-like structure from the EI result for a single candidate.
    """
    result_json = {}

    # Extract posterior mean voting preferences and credible intervals
    posterior_means = ei_result.posterior_mean_voting_prefs
    credible_intervals = ei_result.credible_interval_95_mean_voting_prefs

    # Define groups explicitly
    groups = [demographic_group_name, f"Non-{demographic_group_name}"]

    # Populate results for each group
    for group_idx, group in enumerate(groups):
        result_json[group] = {
            "posterior_mean": float(posterior_means[group_idx]),
            "credible_interval": [float(v) for v in credible_intervals[group_idx]],
        }

        # Calculate PDF data
        x_values = np.linspace(0, 1, 100)
        mean = posterior_means[group_idx]
        interval = credible_intervals[group_idx]
        std_dev = (interval[1] - interval[0]) / 4
        y_values = calculate_pdf(x_values, mean, std_dev)

        result_json[group]["pdf_data"] = {
            "x": x_values.tolist(),
            "y": y_values.tolist(),
        }

    # Return the structure for the specific candidate
    return {candidate_name: result_json}

def main():
    """
    Main function to load and process precinct data.
    """
    # 1.First Load the Data
    precinct_data = load_precinct_data(DATA_FILE)

    # 2.Then Preprocess the precinct data
    df = preprocess_data(precinct_data)
    # df = df.sample(n=100, random_state=42)
    df = df.head(20)

    # Perform EI for all races
    race_results = perform_ei_for_all_races(df)

    # # Perform EI for grouped income and region types
    # group_columns = ["Income_Group", "Region_Type"]
    # grouped_results = perform_grouped_ei(df, group_columns)

    # # Combine results
    # all_results = {
    #     "race_results": race_results,
    #     "grouped_results": grouped_results
    # }

    # Output results to a JSON file
    with open('ei_results.json', 'w') as f:
        json.dump(race_results, f, indent=4)

    print("EI analysis completed and results saved to ei_results.json")

    # 3.Perform twobytwo EI
    # ei = perform_2x2_ei(df)
    # print(ei.summary())

    # ei.plot()
    # plt.savefig("plot6.png")

if __name__ == "__main__":
    main()























# import numpy as np
# import pymc as pm
# import json
# from scipy.stats import norm

# import pandas as pd
# from pyei.data import Datasets # type: ignore    
# from pyei.two_by_two import TwoByTwoEI # type: ignore
# from pyei.r_by_c import RowByColumnEI # type: ignore
# from pyei.io_utils import from_netcdf, to_netcdf # type: ignore

# import matplotlib.pyplot as plt
# import arviz as az

# # File path for the JSON file
# DATA_FILE = './resources/south-carolina-precinct-info.json'

# def calculate_pdf(x, mean, std_dev):
#     """
#     Uses the probabilty density function
#     """
#     return (1 / (np.sqrt(2 * np.pi) * std_dev)) * np.exp(-0.5 * ((x - mean) / std_dev) ** 2)

# def load_precinct_data(file_path):
#     """
#     Load and parse the JSON file to extract precinct data.
#     """
#     try:
#         with open(file_path, 'r') as f:
#             data = json.load(f)  # Load the entire JSON file
            
#         # Access the first object in the array and extract "precincts"
#         if isinstance(data, list) and len(data) > 0:
#             precincts = data[0].get('precincts', [])
#         else:
#             precincts = []

#         return precincts

#     except FileNotFoundError:
#         print(f"File not found: {file_path}")
#         return []
#     except json.JSONDecodeError as e:
#         print(f"Error decoding JSON: {e}")
#         return []

# def preprocess_data(precincts):
#     """
#     Process each precinct and extract/transform the required data.
#     """
#     total_population = []
#     hispanic_population = []
#     asian_population = []
#     white_population = []
#     black_population = []
#     republican_votes = []
#     democratic_votes = []
#     precinct_pop = []

#     # Extract the relevant data for each precinct
#     for precinct in precincts:
#         precinct_pop.append(precinct.get("GEOID20"))
#         total_population.append(precinct.get("total_population", 0))
#         hispanic_population.append(precinct.get("hispanic", 0))
#         asian_population.append(precinct.get("asian", 0)),
#         white_population.append(precinct.get("white", 0)),
#         black_population.append(precinct.get("black", 0)),
#         republican_votes.append(precinct.get("2020_PRES_R", 0))
#         democratic_votes.append(precinct.get("2020_PRES_D", 0))

#     # Create a pandas DataFrame
#     df = pd.DataFrame({
#         "Precinct": precinct_pop,
#         "Total_Population": total_population,
#         "Hispanic": hispanic_population,
#         "Asian": asian_population,
#         "White": white_population,
#         "Black": black_population,
#         "Republican_Votes": republican_votes,
#         "Democratic_Votes": democratic_votes,

#     })
#     return df

# def perform_2x2_ei(dataframe):
#     """
#     Perform a 2x2 ecological inference analysis using pyEI.
#     """
#     # Ensure the columns are in numpy arrays for pyEI
#     precinct_names = np.array(dataframe["Precinct"])
#     total_population = np.array(dataframe["Total_Population"])
#     hispanic_population = np.array(dataframe["Hispanic"])
#     republican_votes = np.array(dataframe["Republican_Votes"])
#     democratic_votes = np.array(dataframe["Democratic_Votes"])

#     # Filter valid indices
#     valid_indices = (total_population > 0)
#     total_population = total_population[valid_indices]
#     hispanic_population = hispanic_population[valid_indices]
#     republican_votes = republican_votes[valid_indices]
#     democratic_votes = democratic_votes[valid_indices]

#     # Compute fractions
#     group_fractions = hispanic_population / total_population
#     votes_fraction = np.column_stack((republican_votes / total_population,))

#     # Handle invalid or missing values
#     group_fractions = np.nan_to_num(group_fractions, nan=0.5, posinf=1.0, neginf=0.0)
#     votes_fraction = np.nan_to_num(votes_fraction, nan=0.5, posinf=1.0, neginf=0.0)

#     # Validate sizes
#     if group_fractions.size == 0 or votes_fraction.size == 0 or total_population.size == 0:
#         raise ValueError("Processed data arrays are empty. Please check input data and preprocessing.")

#     # Ensure fractions are within valid ranges (0 to 1)
#     group_fractions = np.clip(group_fractions, 0, 1)
#     votes_fraction = np.clip(votes_fraction, 0, 1)

#     ei_2by2 = TwoByTwoEI(model_name="king99", lmbda=0.5)
    
#     # Fit the model with the data
#     ei_2by2.fit(
#        group_fraction = group_fractions.astype(np.float32),
#        votes_fraction =votes_fraction.astype(np.float32),
#        precinct_pops = total_population.astype(np.float32), #total2
#        demographic_group_name = "Hispanic",
#        candidate_name= "Republican",
#        draws=500,  # Increase for better posterior distribution
#        tune=500,   # Adjust as necessary
#     )
    
#     return ei_2by2

# def main():
#     """
#     Main function to load and process precinct data.
#     """
#     # 1.First Load the Data
#     precinct_data = load_precinct_data(DATA_FILE)

#     # 2.Then Preprocess the precinct data
#     df = preprocess_data(precinct_data)
#     df = df.head(20)
#     print(df)

#     # 3.Perform twobytwo EI
#     ei = perform_2x2_ei(df)
#     print(ei.summary())
#     posterior_samples = ei.sim_trace['posterior']['kappa'].values
#     az.plot_posterior(posterior_samples)
#     plt.show()
#     plt.savefig("plot7.png")

#     # 4.Plot the Results and save the image
#     ei.plot()
#     plt.savefig("plot6.png")

# if __name__ == "__main__":
#     main()

# import numpy as np
# import pymc as pm  # type: ignore
# import json
# import pandas as pd
# from pyei.two_by_two import TwoByTwoEI  # type: ignore
# import matplotlib.pyplot as plt
# import seaborn as sns

# # Load your data file
# DATA_FILE = './resources/south-carolina-precinct-info.json'

# def load_precinct_data(file_path):
#     """
#     Load and parse the JSON file to extract precinct data.
#     """
#     with open(file_path, 'r') as f:
#         data = json.load(f)
#     precincts = data[0].get('precincts', []) if isinstance(data, list) else []
#     return precincts


# def preprocess_data(precincts):
#     """
#     Process each precinct and extract/transform the required data.
#     """
#     total_population = []
#     hispanic_population = []
#     republican_votes = []

#     for precinct in precincts:
#         total_population.append(precinct.get("total_population", 0))
#         hispanic_population.append(precinct.get("hispanic", 0))
#         republican_votes.append(precinct.get("2020_PRES_R", 0))

#     # Create a DataFrame
#     df = pd.DataFrame({
#         "Total_Population": total_population,
#         "Hispanic": hispanic_population,
#         "Republican_Votes": republican_votes,
#     })
#     return df


# def perform_2x2_ei(dataframe):
#     """
#     Perform a 2x2 ecological inference analysis using pyEI.
#     """
#     # Extract relevant columns
#     total_population = np.array(dataframe["Total_Population"])
#     hispanic_population = np.array(dataframe["Hispanic"])
#     republican_votes = np.array(dataframe["Republican_Votes"])

#     group_fractions = hispanic_population / total_population
#     votes_fraction = np.column_stack((republican_votes / total_population,))

#     # Handle NaNs and infinity
#     group_fractions = np.nan_to_num(group_fractions, nan=0.5, posinf=1.0, neginf=0.0)
#     votes_fraction = np.nan_to_num(votes_fraction, nan=0.5, posinf=1.0, neginf=0.0)

#     ei_2by2 = TwoByTwoEI(model_name="king99", lmbda=0.5)
#     ei_2by2.fit(
#         group_fraction=group_fractions.astype(np.float32),
#         votes_fraction=votes_fraction.astype(np.float32),
#         precinct_pops=total_population.astype(np.float32),
#         demographic_group_name="Hispanic",
#         candidate_name="Republican",
#         draws=500,
#         tune=500,
#     )
#     return ei_2by2


# def plot_with_sim_trace(sim_trace, group_names, candidate_name):
#     """
#     Plot the posterior distribution manually using `sim_trace`.
#     """
#     # Combine chains and draws into a single dimension
#     posterior_samples = sim_trace['posterior']['b_1'].stack(all_draws=("chain", "draw")).values

#     # Extract samples for each group
#     group_1_samples = posterior_samples[:, 0]  # Hispanic
#     print(group_1_samples)
#     group_2_samples = posterior_samples[:, 1]  # Non-Hispanic

#     # Plot density for each group
#     sns.kdeplot(group_1_samples, label=f"{group_names[0]} ({candidate_name})", fill=True, alpha=0.5)
#     sns.kdeplot(group_2_samples, label=f"{group_names[1]} ({candidate_name})", fill=True, alpha=0.5)

#     # Add labels and title
#     plt.xlabel("Percentage of Support")
#     plt.ylabel("Density")
#     plt.title(f"Manual Posterior Plot for {candidate_name}")
#     plt.legend()
#     plt.show()
#     plt.savefig("Hi.png")  # Save the plot for comparison



# def main():
#     # Step 1: Load the data
#     precinct_data = load_precinct_data(DATA_FILE)

#     # Step 2: Preprocess the data
#     df = preprocess_data(precinct_data)
#     df = df.head(20)

#     # Step 3: Perform EI
#     ei = perform_2x2_ei(df)

#     # Step 4: Plot using ei.plot()
#     print("Plotting using ei.plot()")
#     ei.plot()
#     plt.savefig("ei_plot.png")  # Save the plot for comparison

#     # Step 5: Plot manually using sim_trace
#     print("Plotting manually using sim_trace")
#     plot_with_sim_trace(
#         ei.sim_trace,
#         group_names=["Hispanic", "Non-Hispanic"],
#         candidate_name="Republican",
#     )

# if __name__ == "__main__":
#     main()

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

    # Extract the relevant data for each precinct
    for precinct in precincts:
        precinct_pop.append(precinct.get("GEOID20"))
        total_population.append(precinct.get("total_population", 0))
        hispanic_population.append(precinct.get("hispanic", 0))
        asian_population.append(precinct.get("asian", 0)),
        white_population.append(precinct.get("white", 0)),
        black_population.append(precinct.get("black", 0)),
        republican_votes.append(precinct.get("2020_PRES_R", 0))
        democratic_votes.append(precinct.get("2020_PRES_D", 0))

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

    })
    print(df)
    return df

def perform_2x2_ei(dataframe):
    """
    Perform a 2x2 ecological inference analysis using pyEI.
    """
    # Ensure the columns are in numpy arrays for pyEI
    precinct_names = np.array(dataframe["Precinct"])
    total_population = np.array(dataframe["Total_Population"])
    hispanic_population = np.array(dataframe["Hispanic"])
    republican_votes = np.array(dataframe["Republican_Votes"])
    democratic_votes = np.array(dataframe["Democratic_Votes"])

    valid_indices = total_population > 0
    total_population = total_population[valid_indices]
    hispanic_population = hispanic_population[valid_indices]
    republican_votes = republican_votes[valid_indices]
    democratic_votes = democratic_votes[valid_indices]
    
    group_fractions = hispanic_population / total_population  # Fraction of Hispanic population
    votes_fraction = np.column_stack((republican_votes / total_population,))
    print(f"This is the fraction votes: {votes_fraction}")
    group_fractions = np.nan_to_num(group_fractions, nan=0.0, posinf=0.0, neginf=0.0)
    votes_fraction = np.nan_to_num(votes_fraction, nan=0.0, posinf=0.0, neginf=0.0)
    print(f"This is the group fractions: {group_fractions}")

    ei_2by2 = TwoByTwoEI(model_name="king99", lmbda=0.5)
    
    # Fit the model with the data
    ei_2by2.fit(
       group_fraction = group_fractions.astype(np.float32),
       votes_fraction =votes_fraction.astype(np.float32),
       precinct_pops = total_population.astype(np.float32), #total2
    #    precinct_names = precinct_names,
       demographic_group_name = "Hispanic", #demon
       candidate_name= "Republican",
        draws=1000,  # Increase for better posterior distribution
        tune=1500,   # Adjust as necessary
        target_accept=0.95  # Modify acceptance rate
    )

    return ei_2by2

def main():
    """
    Main function to load and process precinct data.
    """
    # 1.First Load the Data
    precinct_data = load_precinct_data(DATA_FILE)

    # 2.Then Preprocess the precinct data
    df = preprocess_data(precinct_data)
    # df = df.sample(n=100, random_state=42)
    df = df.head(100)
    print(df)

    # #An example of finding the y-axis
    # mean_e_asian = 0.803
    # sd_e_asian = (0.952 - 0.606) / 4
    # x = np.linspace(0, 1, 100)
    # print(x)
    # y_e_asian = norm.pdf(x, loc=mean_e_asian, scale=sd_e_asian)
    # # print(f"This is the y-axis:{y_e_asian}")

    # mean_non_e_asian = 0.245
    # sd_non_e_asian = (0.278 - 0.219) / 4
    # y_non_e_asian = norm.pdf(x, loc=mean_non_e_asian, scale=sd_non_e_asian)


    # plt.plot(x, y_e_asian, label="e_asian", color="teal", alpha=0.7)
    # plt.plot(x, y_non_e_asian, label="non_e_asian", color="orange", alpha=0.7)
    # plt.savefig("plot6.png")


#     # 3.Perform twobytwo EI
    ei = perform_2x2_ei(df)
    print(ei.summary())

# #     # 4.Plot the Results and save the image
    ei.plot()
    plt.savefig("plot6.png")

if __name__ == "__main__":
    main()
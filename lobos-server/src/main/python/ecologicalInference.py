import numpy as np
import pymc as pm # type: ignore
import json
import os

import pandas as pd
from pyei.data import Datasets # type: ignore    
from pyei.two_by_two import TwoByTwoEI # type: ignore
from pyei.r_by_c import RowByColumnEI # type: ignore
from pyei.io_utils import from_netcdf, to_netcdf # type: ignore

import matplotlib.pyplot as plt

# File path for the JSON file
DATA_FILE = './resources/precinct-info.json'

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
    republican_votes = []
    democratic_votes = []

    # Extract the relevant data for each precinct
    for precinct in precincts:
        total_population.append(precinct.get("total_population", 0))
        hispanic_population.append(precinct.get("hispanic", 0))
        republican_votes.append(precinct.get("2020_PRES_R", 0))
        democratic_votes.append(precinct.get("2020_PRES_D", 0))

    # Create a pandas DataFrame
    df = pd.DataFrame({
        "Total_Population": total_population,
        "Hispanic": hispanic_population,
        "Republican_Votes": republican_votes,
        "Democratic_Votes": democratic_votes
    })
    print(df)
    return df

def perform_2x2_ei(dataframe):
    """
    Perform a 2x2 ecological inference analysis using pyEI.
    """
    # Ensure the columns are in numpy arrays for pyEI
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
    votes_fraction = np.column_stack((
        republican_votes / total_population,
    ))
    print(votes_fraction)
    group_fractions = np.nan_to_num(group_fractions, nan=0.0, posinf=0.0, neginf=0.0)
    votes_fraction = np.nan_to_num(votes_fraction, nan=0.0, posinf=0.0, neginf=0.0)

    ei_2by2 = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=15, pareto_shape=2)
    
    # Fit the model with the data
    ei_2by2.fit(
       group_fraction=group_fractions,
       votes_fraction=votes_fraction,
       precinct_pops=total_population,
       demographic_group_name = "Hispanic",
       candidate_name= "Republican",
       draws=500,  # Reduce the number of posterior draws
       tune=1000,  # Lower the tuning iterations
       target_accept=0.95  # Adjust target acceptance rate
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
    print(df.head())


    # 3.Perform twobytwo EI
    ei = perform_2x2_ei(df)

#     # 4.Plot the Results and save the image
#     ei.plot()
#     plt.savefig("plot3.png")
    print(ei.summary())
# santa_clara_data = Datasets.Santa_Clara.to_dataframe()

# group_fraction_2by2 = np.array(santa_clara_data["pct_e_asian_vote"])
# votes_fraction_2by2 = np.array(santa_clara_data["pct_for_hardy2"])
# precinct_pops = np.array(santa_clara_data["total2"])

# # print(santa_clara_data["pct_e_asian_vote"])
# # print(group_fraction_2by2)
# print(santa_clara_data)

# demographic_group_name_2by2 = "e_asian"
# candidate_name_2by2 = "Hardy"
# precinct_names = santa_clara_data['precinct']

# santa_clara_data.head()

# ei_2by2 = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=15, pareto_shape=2)

# # Fit the model
# ei_2by2.fit(
#        group_fraction_2by2, 
#        votes_fraction_2by2, 
#        precinct_pops, 
#        demographic_group_name = demographic_group_name_2by2, 
#        candidate_name = candidate_name_2by2, 
# )

# # Generate a simple report to summarize the results
# print(ei_2by2.summary())

if __name__ == "__main__":
    main()

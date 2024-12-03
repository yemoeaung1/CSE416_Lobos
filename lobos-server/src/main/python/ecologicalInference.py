import numpy as np
import pymc as pm # type: ignore

from pyei.data import Datasets # type: ignore
from pyei.two_by_two import TwoByTwoEI # type: ignore
from pyei.goodmans_er import GoodmansER # type: ignore
from pyei.goodmans_er import GoodmansERBayes # type: ignore
from pyei.r_by_c import RowByColumnEI # type: ignore
from pyei.io_utils import from_netcdf, to_netcdf # type: ignore

# Example 2x2 data
# santa_clara_data = Datasets.Santa_Clara.to_dataframe()

# group_fraction_2by2 = np.array(santa_clara_data["pct_e_asian_vote"])
# votes_fraction_2by2 = np.array(santa_clara_data["pct_for_hardy2"])

# demographic_group_name_2by2 = "e_asian"
# candidate_name_2by2 = "Hardy"

# # Example rxc data (here r=c=3)
# group_fractions_rbyc = np.array(santa_clara_data[['pct_ind_vote', 'pct_e_asian_vote', 'pct_non_asian_vote']]).T
# votes_fractions_rbyc = np.array(santa_clara_data[['pct_for_hardy2', 'pct_for_kolstad2', 'pct_for_nadeem2']]).T

# candidate_names_rbyc = ["Hardy", "Kolstad", "Nadeem"]
# demographic_group_names_rbyc = ["ind", "e_asian", "non_asian"]

# # Data we'll use in both 2x2 and rbyc
# precinct_pops = np.array(santa_clara_data["total2"])
# precinct_names = santa_clara_data['precinct']

# # # tomography_plot(group_fraction_2by2, votes_fraction_2by2, demographic_group_name=demographic_group_name_2by2, candidate_name=candidate_name_2by2)

# # Create a TwobyTwoEI object
# ei_2by2 = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=8, pareto_shape=2)

# # Fit the model
# ei_2by2.fit(group_fraction_2by2, 
#        votes_fraction_2by2, 
#        precinct_pops, 
#        demographic_group_name=demographic_group_name_2by2, 
#        candidate_name=candidate_name_2by2, 
#        precinct_names=precinct_names, 
# )

# # Create a RowByColumnEI object
# ei_rbyc = RowByColumnEI(model_name='multinomial-dirichlet-modified', pareto_shape=100, pareto_scale=100)

# # Fit the model
# ei_rbyc.fit(group_fractions_rbyc, 
#        votes_fractions_rbyc, 
#        precinct_pops, 
#        demographic_group_names=demographic_group_names_rbyc, 
#        candidate_names=candidate_names_rbyc, 
#        #precinct_names=precinct_names, 
# )

# # # Create a GoodmansER object
# # goodmans_er = GoodmansER() 

# # # Fit the model
# # goodmans_er.fit(
# #     group_fraction_2by2, 
# #     votes_fraction_2by2,
# #     demographic_group_name=demographic_group_name_2by2, 
# #     candidate_name=candidate_name_2by2
# # )
# # print(goodmans_er.summary())

# # # Create a GoodmansERBayes object
# # bayes_goodman_ei = GoodmansERBayes("goodman_er_bayes", weighted_by_pop=True, sigma=1)

# # # Fit the model
# # bayes_goodman_ei.fit(
# #     group_fraction_2by2, 
# #     votes_fraction_2by2,
# #     precinct_pops,
# #     demographic_group_name=demographic_group_name_2by2, 
# #     candidate_name=candidate_name_2by2
# # )

# ei_2by2.plot() # Summary plot 
# # ei_rbyc.plot()

santa_clara_data = Datasets.Santa_Clara.to_dataframe()

group_fraction_2by2 = np.array(santa_clara_data["pct_e_asian_vote"])
votes_fraction_2by2 = np.array(santa_clara_data["pct_for_hardy2"])
precinct_pops = np.array(santa_clara_data["total2"])

demographic_group_name_2by2 = "e_asian"
candidate_name_2by2 = "Hardy"
precinct_names = santa_clara_data['precinct']

santa_clara_data.head()

ei_2by2 = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=15, pareto_shape=2)

# Fit the model
ei_2by2.fit(group_fraction_2by2, 
       votes_fraction_2by2, 
       precinct_pops, 
       demographic_group_name=demographic_group_name_2by2, 
       candidate_name=candidate_name_2by2, 
       precinct_names=precinct_names, 
       draws=1200, # optional
       tune=3000, # optional
       target_accept=.99# optional
)

# Generate a simple report to summarize the results
print(ei_2by2.summary())

ei_rbyc = RowByColumnEI(model_name='multinomial-dirichlet-modified', pareto_shape=100, pareto_scale=100)
ei_2by2.plot()

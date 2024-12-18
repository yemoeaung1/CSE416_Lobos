
const fieldNamesToDisplay = {
    'non_hispanic': 'Non-Hispanic',
    'hispanic': 'Hispanic',
    'white': 'White',
    'black': 'Black',
    'asian': 'Asian',
    'LESS_10K': '< $10K',
    "10K_15K": '$10K - $15K',
    "15K_20K": '$15K - $20K',
    "20K_25K": '$20K - $25K',
    "25K_30K": '$25K - $30K',
    "30K_35K": '$30K - $35K',
    "35K_40K": '$35K - $40K',
    "40K_45K": '$40K - $45K',
    "45K_50K": '$45K - $50K',
    "50K_60K": '$50K - $60K',
    "60K_75K": '$60K - $75K',
    "75K_100K": '$75K - $100K',
    "100K_125K": '$100K - $125K',
    "125K_150K": '$125K - $150K',
    "150K_200K": '$150K - $200K',
    "200K_MORE": '> $200K',
    "2020_PRES_R": 'Republican Votes (2020)',
    "2020_PRES_D": 'Democratic Votes (2020)',
    'POPULATION_RURAL': 'Rural Population',
    'POPULATION_URBAN': 'Urban Population',
    'POPULATION_SUBURBAN': 'Suburban Population',
    'demographics': 'Demographics',
    'income': 'Income Levels',
    'regionType': 'Region Type',
    // 'Voting': 'Voting',
}

const groupedCategories = {
    demographics: ['non_hispanic', 'hispanic', 'white', 'black', 'asian'],
    income: ['LESS_10K', '10K_15K', '15K_20K', '20K_25K', '25K_30K', '30K_35K', '35K_40K', '40K_45K', '45K_50K', '50K_60K', '60K_75K', '75K_100K', '100K_125K', '125K_150K', '150K_200K', '200K_MORE'],
    regionType: ['POPULATION_RURAL', 'POPULATION_URBAN', 'POPULATION_SUBURBAN'],
    // Voting: ['2020_PRES_R', '2020_PRES_D']
};


export { fieldNamesToDisplay, groupedCategories };
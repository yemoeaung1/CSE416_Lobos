import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export function createCustomDropdown(label, labelID, val, setVal, options){
    return (
        <FormControl fullWidth>
            <InputLabel id={labelID} sx={{ fontFamily: "Montserrat, san-serif" }}>{label}</InputLabel>
            <Select
                labelId={labelID}
                value={val}
                onChange={(event) => setVal(event.target.value)}
                label={label}
                sx={{
                    height: '48px',
                    fontFamily: 'Montserrat, sans-serif',
                }}
            >
                {options.map(({ text, value }, index) => (
                    <MenuItem sx={{ fontFamily: 'Montserrat, sans-serif', }} key={index} value={value}>
                        {text}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export function createCustomDropdownNoValue(label, labelID, val, setVal, options){
    return (
        <FormControl fullWidth>
            <InputLabel id={labelID} sx={{ fontFamily: "Montserrat, san-serif" }}>{label}</InputLabel>
            <Select
                labelId={labelID}
                value={val}
                onChange={(event) => setVal(event.target.value)}
                label={label}
                sx={{
                    height: '48px',
                    fontFamily: 'Montserrat, sans-serif',
                }}
            >
                {options.map((option, index) => (
                    <MenuItem sx={{ fontFamily: 'Montserrat, sans-serif', }} key={index} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
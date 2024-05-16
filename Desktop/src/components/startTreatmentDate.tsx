import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import {Grid} from "@mui/material";
import DateFnsUtils from '@date-io/date-fns';

import { TextField } from '@mui/material';

const StartTreatmentDate = ({ startTreatmentDate, setStartTreatmentDate }) => {
  return (
    <Grid item xs={12}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Start Treatment Date"
          value={startTreatmentDate}
          onChange={(newValue) => setStartTreatmentDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>
    </Grid>
  );
};

export default StartTreatmentDate;

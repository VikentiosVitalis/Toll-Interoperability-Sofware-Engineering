/* All the needed components for the page are imported */
import React, { useState } from 'react';
import { GiMoneyStack } from 'react-icons/gi';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

/* Ref forwarding is an opt-in feature that lets some components take a ref they receive, and pass it further down (in other words, “forward” it) to a child. */
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Settlement = ({ settlements, clearSettlement}) => {

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  /* In the settlement page the logged-in operator can see the settlements which are already issue and those which are to be issued */
  const content = settlements.map((settlement) => (
    <div
      className={settlement.Cleared ? 'todo-row cleared' : 'todo-row uncleared'}
      key={settlement.SettlementID}
    >
        Amount: {settlement.Amount}, Credited to: {settlement.OperatorCredited}
      <div className='icons'>
        <GiMoneyStack
          onClick={() => {
            if(!settlement.Cleared)
              clearSettlement(settlement.SettlementID)
            else
              setOpen(true)
            }
          }
          className='pay-icon'
        />
      </div>
    </div>
  ));

  return (
    <>
      {content}
      {/* In case of error an error-message appears */}
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Settlement already cleared!
        </Alert>
      </Snackbar>
    </>
  )

};

export default Settlement;
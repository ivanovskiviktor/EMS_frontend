import React from "react";
import {Button, Dialog, DialogActions, Slide} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);
    props.handleDelete();
  };

  return (
    <div style={{display: 'inline'}}>
      <button type="button" class="btn btn-danger" variant="contained" onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faTrash}/>
        <span className="btn-wrapper--label">Избриши</span>
      </button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/*<DialogTitle id="alert-dialog-title">*/}
        {/*  {"Дали сигурно сакате да го избришете записот?"}*/}
        {/*</DialogTitle>*/}
        <h5 id="alert-dialog-title" className="p-3">
            Дали сигурно сакате да го избришете записот?
        </h5>
        {/*<DialogContent>*/}
        {/*  <DialogContentText id="alert-dialog-description">*/}
        {/*    Let Google help apps determine location. This means sending anonymous*/}
        {/*    location data to Google, even when no apps are running.*/}
        {/*  </DialogContentText>*/}
        {/*</DialogContent>*/}
        <DialogActions>
          <Button onClick={handleClose}>Откажи</Button>
          <Button onClick={handleDelete} className="btn text-danger">
            Избриши
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

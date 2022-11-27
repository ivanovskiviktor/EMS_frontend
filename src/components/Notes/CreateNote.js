import React, { Component, Fragment } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import { DialogContent } from "@material-ui/core";
import NoteService from "../service/NoteService";
import Swal from "sweetalert2";
import {sleep} from "../shared/functions/Sleep";

export default class CreateNote extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            noteHelper: {
                description: ""
            },
            open: true
        }
    }

    handleChange = (e) =>
    this.setState({
        noteHelper: {
            ...this.state,
            [e.target.name]: e.target.value || null,
        },
    });

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    createNote() {
        var noteHelper = {
            description: this.state.noteHelper.description
        };
        NoteService.addNote(noteHelper)
            .then((res) => {
                this.setState({
                    noteHelper: {
                        data: res.data,
                    }
                });
                this.handleClose();
                sleep(500);
                Swal.fire({
                    icon: "success",
                    title: "Успешно!",
                    text: "Успешно поставена забелешка!",
                  }).then(() => {
                    if(this.props.onClose)
                      {
                          this.props.onClose();
                      }
                    }
                  );
                }).catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Грешка!',
                        text: 'Неуспешно поставена забелешка!',
                    })
            });
    }

    render() {
        return (
            <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogTitle style={{fontSize: "20px"}}>Постави забелешка во однос на работата</DialogTitle>
            <DialogContent>
            <Fragment>
            <FormControl>
                <FormLabel>Забелешка</FormLabel>
                <Textarea placeholder="Внеси забелешка" minRows={1} name="description" id="description" onChange={this.handleChange}/>
            </FormControl>
            </Fragment>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={this.handleClose}>Oткажи</Button>
                <Button type="submit" color="success" onClick={() => this.createNote()}>Постави</Button>
            </DialogActions>
            </Dialog>
        )
    }
}   
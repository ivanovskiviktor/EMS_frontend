import React, {Fragment, useState} from 'react';
import {FormControl, InputGroup} from "react-bootstrap";
import {TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles( theme => ({
  inputRoot: {
    background: "white",
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      paddingTop: 2
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4C5782"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4C5782"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4C5782"
    },
  }
}))

export default function SearchBar (props) {

  const [keyword, setKeyword] = useState('')
  const [options, setOptions] = useState(props.list)
  const classes = useStyles()

  const handleSearchBar = (e, eventValue) => {
    if (props.list) {
      if (props.multi) {
        props.handleSearch(props.id, eventValue.map( m => m.value ))

        const results = props.list.filter(({ value: id1 }) => !eventValue.some(({ value: id2 }) => id2 === id1));
        setOptions(results)
      } else {

        if (eventValue){
          setKeyword(eventValue.name)
          props.handleSearch(props.id, eventValue.name)
        } else {
          setKeyword('')
          props.handleSearch(props.id, '')
        }
      }

    } else {
      setKeyword(e.target.value)
      props.handleSearch(props.id, e.target.value)
    }
  }

  return (
    <Fragment>
      {props.list ?
        <Autocomplete
          id={props.id}
          classes={classes}
          onChange={handleSearchBar}
          options={options}
          disableCloseOnSelect={!!props.multi}
          multiple={!!props.multi}
          style={{ width: "100%" }}
          size="small"
          getOptionLabel={(option) => option.label ? option.label : option.name}
          renderInput={(params) => (
            <TextField {...params}
                       fullWidth
                       variant="outlined"
            />
          )}
        />
      :
        <InputGroup className="">
          <FormControl
            id={props.id}
            style={{ height: '34px' }}
            value={keyword}
            name="keyword"
            size="sm"
            disabled={false}
            onChange={handleSearchBar}
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
        </InputGroup>}
    </Fragment>
  );
}

import axios from 'axios';
import instance from '../instance/instance';

const NoteService ={

    getNotesPageable:(page,pageSize)=>{
        return instance.get(`/rest/note/all/${page}/${pageSize}`)
    },

    addNote:(description) => {
        return instance.post('rest/note/create', description)
      }
}
export default NoteService;
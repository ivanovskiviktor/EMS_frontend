import axios from 'axios';
import instance from '../instance/instance';

const NoteService ={

    getNotesPageable:(page,pageSize)=>{
        return instance.get(`/rest/note/all/${page}/${pageSize}`)
    }
}
export default NoteService;
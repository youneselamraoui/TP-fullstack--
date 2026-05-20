<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h4>
                    Add Students
                </h4>
            </div>
            <div class="card-body">
            <div class="mb-3">
                <label for="">Nom</label>
                <input type="text" v-model="model.student.nom" class="form-control"/>
            </div>
            <div class="mb-3">
                <label for="">Prenom</label>
                <input type="text" v-model="model.student.prenom" class="form-control"/>
            </div>
            <div class="mb-3">
                <label for="">Telephone</label>
                <input type="text" v-model="model.student.telephone" class="form-control"/>
            </div>
            <div class="mb-3">
                <label for="">Email</label>
                <input type="text" v-model="model.student.email" class="form-control"/>
            </div>
            <div class="mb-3">
                <button type="button" @click="saveStudent" class="btn btn-primary">Save</button>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';

export default{
    name: 'studentCreate',
    data(){
       return{
        model: {
            student: {
                nom:'',
                prenom:'',
                telephone:'',
                email:''
            }
        }
       } 
    },
    methods:{
        saveStudent(){
        axios.post('http://localhost:3000/api/student', this.model.student)
        .then(res => {
               console.log(res.data)
               alert(res.data.message);
               this.model.student = {
                nom:'',
                prenom:'',
                telephone:'',
                email:''
            }
        })
    }
}    
}
</script>
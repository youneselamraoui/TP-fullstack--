<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h4>
                    Students
                    <RouterLink to="/students/create" class="btn btn-primary float-end">
                        Add Student
                    </RouterLink>
                </h4>
            </div>
            <div class="card-body">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>nom</th>
                            <th>prenom</th>
                            <th>telephone</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody v-if="this.students.length > 0">  
                        <tr v-for="student in students" :key="student.id">
                            <td>{{ student.id }}</td>
                            <td>{{ student.nom }}</td>
                            <td>{{ student.prenom }}</td>
                            <td>{{ student.telephone }}</td>
                            <td>{{ student.email }}</td>
                            <td>
                                <RouterLink to="/students/create" class="btn btn-success float-end">
                                   Edit
                                </RouterLink>
                                <button type="button" class="btn btn-success float-end">
                                  Delete  
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="5">Loading...</td>
                        </tr>
                    </tbody>
                </table>  
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'students',
    data() {
        return {
            students: []
        }
    },
    mounted() {
        this.getStudents();  // ✅ appel au chargement
    },
    methods: {
        getStudents() {
            axios.get('http://localhost:3000/api/student')
                .then(res => {
                    this.students = res.data;  // ✅ pas res.data.students
                })
                .catch(err => {
                    console.error('Erreur:', err);
                });
        }
    }
}
</script>
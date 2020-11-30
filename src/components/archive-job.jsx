import React, { useState, useEffect } from "react"
//api
import app from "../firebase";
import {useData} from '../api/provider'
import {auth} from "../firebase";
import {getRate,getClientData,deleteClient,queryClientData} from '../api/data'
// import { RiListSettingsFill,RiInboxUnarchiveLine } from "react-icons/ri";
// import { GrPauseFill, GrPlayFill,GrShare} from 'react-icons/gr';
// import { RiArchiveLine } from "react-icons/ri";



const ArchivedJob = (aJobProps,jobs,archivedJobs,client) => {
    const [jobsState, setJobs] = useState([])

    const db = app.firestore();
    const userUid = auth.currentUser.uid
    const cliData = db.collection('users').doc(userUid).collection('clients').doc(aJobProps.client)
    cliData.get()

    console.log(cliData)
    console.log(jobs,'jobs')
    useEffect(() => {

        const jobsArray =  Array.from(jobs)
        let mapJob = jobsArray.map( (job) => job.job)
        
        let jobArray = [aJobProps]
        var newJobs = jobArray.filter(jArr => Object.keys(jArr) === 'jobs');

        console.log(newJobs,'newJobs')
        
        setJobs( 
            [aJobProps],
            )
        console.log(jobs)
        console.log(aJobProps.jobs)
        console.log(aJobProps.client)
        // let newJob = [jobs]
        // let newJob2 = [aJobProps]
        // const newJobs3 = [...newJob,...newJob2]
        // console.log(newJobs3)
        
    },[jobs])


    
       const handleArchive =()=> {
        
            getClientData(client).then((doc) => {
                if (doc.exists) {
                db.settings({
                    timestampsInSnapshots: true
                });
                
                let jobsData = this.props.jobs
                let selectedJob = this.state.selectedJob
                let existingArchive = doc.data().archivedJobs
                
                // filter selected job from array
                let jobsArchived = jobsData.filter(job => job.jobId === selectedJob);
                let archivedJobs = [...existingArchive,...jobsArchived]

                queryClientData(client).update({
                    archivedJobs
                })

                setTimeout(()=>{
                    let jobs = jobsData.filter(job => job.jobId !== selectedJob);
                    queryClientData(client).update({
                    jobs
                    })
                },300)
                
                }
                else {
                console.log('no such document')
                }         
            })
        }

    return (               
            <li > {
                aJobProps.job
                }
                {
                    new Date(aJobProps.jobId) .toString() .slice() .replace(/\GMT(.*)/g, "")
                }
            </li>
        );
}

export default ArchivedJob;



// export default function Archives(aJobs) {

// const [setJobs, jobs] = useState([])

// const achivedJobs = jobs.map( job => {
//     return job
// })

// useEffect((props)=>{
    
//     getClientData(props.aJobs).then((doc)=>{
//         let archives =  doc.data().archivedJobs
//         if (doc.exists) {
//             setJobs(archives)
//         }
//     })
//     console.log(jobs)
// })




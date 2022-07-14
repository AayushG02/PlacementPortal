/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import ClipLoader from "react-spinners/CircleLoader";



function Login() {
    const [loading, setLoading] = useState();
    const [enrollmentNumber, setenrollmentNumber] = useState("");
    const [password, setPassword] = useState("");
    const history = useNavigate();
    var index = Math.floor(Math.random() * 10);
    var check;
    if (index === 9) { index = index - 1 }
   
    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            history.push("/dashboard")
        }
    }, [])

    function checkFetch(semesterCode) {
        setLoading(true)
        if (localStorage.getItem(`faculty-${semesterCode}`)) {
            check = true;
        }
        else {
            check = false;
            setTimeout(() => {
                checkFetch(semesterCode);
            }, 3000);

        }
    }
    function redirect() {
        setLoading(true)
        if (check === true) {
            setLoading(false);
            history.push("/dashboard");
        }
        else {
            setTimeout(() => {
                redirect();
            }, 3000);

        }
    }

    async function grade(semesterCode) {
        setLoading(true)
        let item = { enrollmentNumber, password }
        let grades = await fetch(`https://webkiosk-juit.herokuapp.com/api/examGrade?semester=${semesterCode}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(item)
        });
        grades = await grades.json();
        localStorage.setItem(`grades-${semesterCode}`, JSON.stringify(grades));
    }
    async function attendance(semesterCode) {
        setLoading(true)
        let item = { enrollmentNumber, password }
        let attendances = await fetch(`https://webkiosk-juit.herokuapp.com/api/attendance?semester=${semesterCode}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(item)
        });
        attendances = await attendances.json();
        localStorage.setItem(`attendances-${semesterCode}`, JSON.stringify(attendances));
    }
    async function moreInfo(semesterCode) {


        //subjects
        setLoading(true)
        let item = { enrollmentNumber, password }
        let subjects = await fetch(`https://webkiosk-juit.herokuapp.com/api/subjects?semester=${semesterCode}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(item)
        });
        subjects = await subjects.json();
        localStorage.setItem(`subjects-${semesterCode}`, JSON.stringify(subjects));


        //subjectFaculty
        setLoading(true)
        let faculty = await fetch(`https://webkiosk-juit.herokuapp.com/api/subjectFaculty?semester=${semesterCode}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(item)
        });
        faculty = await faculty.json();
        localStorage.setItem(`faculty-${semesterCode}`, JSON.stringify(faculty));


    }
    async function login() {


        //credentials
        setLoading(true);
        let item = { enrollmentNumber, password }
        let result = await fetch('https://webkiosk-juit.herokuapp.com/api/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(item)
        });
        result = await result.json();
        if (result.success === true) {
            localStorage.setItem('user-info', JSON.stringify(item));
        }
        else {
            setLoading(false);
            return;
        }


        //CGPA
        let cgpa = await fetch('https://webkiosk-juit.herokuapp.com/api/cgpa', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(item)
        });
        cgpa = await cgpa.json();
        localStorage.setItem('cgpa', JSON.stringify(cgpa));


        //SEMESTERS
        let semesters = await fetch('https://webkiosk-juit.herokuapp.com/api/semesters', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(item)
        });
        semesters = await semesters.json();
        localStorage.setItem('semesters', JSON.stringify(semesters));




        //grades
        semesters.map((code) =>
            grade(code.semesterCode)
        )

        //attendance
        semesters.map((code) =>
            attendance(code.semesterCode)
        )


        //moreinfo(subjects,faculty)
        semesters.map((code) =>
            moreInfo(code.semesterCode)
        )

        semesters.map((code) =>
            checkFetch(code.semesterCode)
        )

        //to dashboard
        redirect();
    }
    //        setTimeout(() => {
    //            setLoading(false);
    //            history.push("/dashboard");    
    //        }, 13000);




    return (
        <>
            {loading ?
                <>
                    <div className="login-screen">
                        <ClipLoader color={'#C715DE'} loading={loading} size={100} />
                    </div>
                    <br />

                </>
                :
                <div className='login'>
                    <div className='login-container'>
                        <p className='login-text'>Login to webkiosk</p>
                        <p className='login-stext'>Enrollment number</p>
                        <input type='text' placeholder='EnrollNo' onChange={(e) => setenrollmentNumber(e.target.value)} className='login-input' />
                        <p className='login-stext'>Password</p>
                        <input type='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} className='login-input' />
                        <button onClick={login} className='login-button'>Log in</button>
                    </div>
                </div>
            }

        </>
    )
}

export default Login
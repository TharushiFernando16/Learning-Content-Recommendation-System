import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Results.css';
import Navbar from "./components/Navbar";

const Results = () => {
    const [results, setResults] = useState({
        programming_fundamentals: '',
        data_structures_and_algorithms: '',
        operating_systems: '',
        database_systems: '',
        object_oriented_programming: '',
        advanced_software_engineering: '',
        artificial_intelligence: '',
        network_security: '',
        basic_electronics: '',
        circuit_analysis: '',
        microprocessor_systems: '',
        digital_electronics: '',
        embedded_systems_design: '',
        power_electronics: '',
        foundations_of_industrial_management: '',
        operations_management: '',
        strategic_management: '',
        linear_algebra: '',
        numerical_methods: '',
        optimization_techniques: '',
        introduction_to_probability_and_statistics: '',
        statistical_inference: '',
        time_series_analysis: ''
    });

    const [studentId, setStudentId] = useState(null);
    useEffect(() => {
        const user_id = localStorage.getItem('user_id');
        console.log('Retrieved user_id:', user_id); // Debugging statement
        if (user_id) {
            setStudentId(user_id);
        } else {
            console.error('User ID not found in localStorage');
        }
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setResults(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting results with studentId:', studentId); // Debugging statement
        if (!studentId) {
            alert("Student ID not found!");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/submit-results', {
                ...results,
                user_id: studentId // Include the student ID in the request
            });
            alert('Results submitted successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting results:', error);
            alert('Failed to submit results.');
        }
    };

    // Dropdown options for results
    const gradeOptions = ['A', 'B', 'C', 'D', 'F', 'Not Graded'];

    return (
        <div>
            <Navbar />
            <div className="results-container">
                <h1>Submit Your Module Results</h1>
                <form onSubmit={handleSubmit}>
                    {/* Programming Fundamentals */}
                    <label>
                        Programming Fundamentals:
                        <select name="programming_fundamentals" value={results.programming_fundamentals} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Data Structures and Algorithms */}
                    <label>
                        Data Structures and Algorithms:
                        <select name="data_structures_and_algorithms" value={results.data_structures_and_algorithms} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Operating Systems */}
                    <label>
                        Operating Systems:
                        <select name="operating_systems" value={results.operating_systems} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Database Systems */}
                    <label>
                        Database Systems:
                        <select name="database_systems" value={results.database_systems} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Object-Oriented Programming */}
                    <label>
                        Object-Oriented Programming:
                        <select name="object_oriented_programming" value={results.object_oriented_programming} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Advanced Software Engineering */}
                    <label>
                        Advanced Software Engineering:
                        <select name="advanced_software_engineering" value={results.advanced_software_engineering} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Artificial Intelligence */}
                    <label>
                        Artificial Intelligence:
                        <select name="artificial_intelligence" value={results.artificial_intelligence} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Network Security */}
                    <label>
                        Network Security:
                        <select name="network_security" value={results.network_security} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Basic Electronics */}
                    <label>
                        Basic Electronics:
                        <select name="basic_electronics" value={results.basic_electronics} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Circuit Analysis */}
                    <label>
                        Circuit Analysis:
                        <select name="circuit_analysis" value={results.circuit_analysis} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Microprocessor Systems */}
                    <label>
                        Microprocessor Systems:
                        <select name="microprocessor_systems" value={results.microprocessor_systems} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Digital Electronics */}
                    <label>
                        Digital Electronics:
                        <select name="digital_electronics" value={results.digital_electronics} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Embedded Systems Design */}
                    <label>
                        Embedded Systems Design:
                        <select name="embedded_systems_design" value={results.embedded_systems_design} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Power Electronics */}
                    <label>
                        Power Electronics:
                        <select name="power_electronics" value={results.power_electronics} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Foundations of Industrial Management */}
                    <label>
                        Foundations of Industrial Management:
                        <select name="foundations_of_industrial_management" value={results.foundations_of_industrial_management} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Operations Management */}
                    <label>
                        Operations Management:
                        <select name="operations_management" value={results.operations_management} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Strategic Management */}
                    <label>
                        Strategic Management:
                        <select name="strategic_management" value={results.strategic_management} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Linear Algebra */}
                    <label>
                        Linear Algebra:
                        <select name="linear_algebra" value={results.linear_algebra} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Numerical Methods */}
                    <label>
                        Numerical Methods:
                        <select name="numerical_methods" value={results.numerical_methods} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Optimization Techniques */}
                    <label>
                        Optimization Techniques:
                        <select name="optimization_techniques" value={results.optimization_techniques} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Introduction to Probability and Statistics */}
                    <label>
                        Introduction to Probability and Statistics:
                        <select name="introduction_to_probability_and_statistics" value={results.introduction_to_probability_and_statistics} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Statistical Inference */}
                    <label>
                        Statistical Inference:
                        <select name="statistical_inference" value={results.statistical_inference} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    {/* Time Series Analysis */}
                    <label>
                        Time Series Analysis:
                        <select name="time_series_analysis" value={results.time_series_analysis} onChange={handleChange}>
                            <option value="">Select Grade</option>
                            {gradeOptions.map((grade, index) => (
                                <option key={index} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </label>

                    <button className="buttonr" type="submit">Submit Results</button>
                </form>
            </div>
        </div>
    );
};

export default Results;
import React, { useState, useEffect, Fragment } from "react";
import { Collapse } from "react-collapse";
import classNames from "classnames";
import ChildTags from "./ChildTags";

/* Parent component that holds the list of students , filtered or unfiltered,
passes data to child first, then child passes data to parent.
child modifies it by adding a tag property to each student,
and attaching that property to studentlist*/
const Studentlist = () => {
  // array to store the student list from the api
  const [studentlist, setStudentlist] = useState([]);
  // state variable that stores the information of the tne name that the user has entered
  const [nameInput, setNameInput] = useState("");
  // state variable that stores the information of the the tag that the user has entered
  const [tagInput, setTagInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [filteredStudentsbyName, setFilteredStudentsbyName] = useState([]);
  const [displayfilteredStudents, setDisplayfilteredStudents] = useState([]);
  // extra boolean to check if user has already used the name filter, if yes boolean is set to true
  const [filteredbyNameAlready, setFilteredbyNameAlready] = useState(false);

  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  /* setTagFromChild: Passing data from child to parent, function that modifies the existing studentlist by adding an additional
  property tags from child, this property will hold all the tags entered by the user, useful
  for filtering by tags. 

  student is an object coming from child which holds all the tags that the user has entered,
  we modify a temporary array tempStudentList to hold the tag properties and then assign it
  to studentlist which will then hold the tags as an extra property*/
  const setTagFromChild = (index, student) => {
    const tempStudentList = [...studentlist];
    //
    tempStudentList[index] = student;
    setStudentlist(tempStudentList);
  };

  // A function which calculates the average given a an array of grades
  const average = (grades) => {
    // numbers: an array to store temporary numbers
    const numbers = [];
    grades.forEach(function (grade) {
      // convert each grade from string to int with parseFloat and add it to numbers
      numbers.push(parseFloat(grade));
    });
    // add up all the grades and divide the result by the length of the array
    const average = numbers.reduce(reducer) / numbers.length;
    return average;
  };

  const fetchStudentList = async () => {
    try {
      const response = await fetch(
        "https://www.hatchways.io/api/assessment/students",
        {
          method: "GET",
        }
      );
      console.log(response);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      console.log(json);
      setStudentlist(json.students);
      setFilteredStudentsbyName(json.students);
      setDisplayfilteredStudents(json.students);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudentList(); // eslint-disable-next-line
  }, []); //

  // Part 3: filter studenlist based on input by user which is e.target.value, ie if user types "Rob" only display students that contains
  // the suggested string (e.target.value) "Rob", add .tolowerCase() function to make searches case insensitive
  const handleNameChange = (e) => {
    // state variable NameInput is used to render what the user has typed in nameInput field
    setNameInput(e.target.value);

    /* we cannot use nameInput, because setNameInput is an asynchronous function and takes time to evaluate,
    by the time we use nameInput in our filter, it will still hold the old value, this causes the filtering not to work.
    therefore we need to use e.target.value for our filtering.
    */
    // const filteredStudents = studentlist.filter(
    //   (student) =>
    //     student.firstName.toLowerCase().slice(0, nameInput.length) ===
    //       nameInput.toLowerCase() ||
    //     student.lastName.toLowerCase().slice(0, nameInput.length) ===
    //       nameInput.toLowerCase()
    // );

    // Right way: use e.target.value for filtering
    const filteredStudents = studentlist.filter(
      (student) =>
        student.firstName.toLowerCase().slice(0, e.target.value.length) ===
          e.target.value.toLowerCase() ||
        student.lastName.toLowerCase().slice(0, e.target.value.length) ===
          e.target.value.toLowerCase()
    );
    setFilteredStudentsbyName(filteredStudents);
    setDisplayfilteredStudents(filteredStudents);
    // tell react that the use has  already filtered by name
    setFilteredbyNameAlready(true);
  };

  // part5: filter students based on tags, after students were filtered by their first or lastname
  const handleTagChange = (e) => {
    // TagInput: set the state variable TagInput to render what the user has typed inside TagInput
    setTagInput(e.target.value);
    /*filter : for each student in studentlist, grab their tags if the student has tags associated, 
    else assign an empty tag to it, and store it in a variable called tag
    and grab the property name from tag and store it in tagname
    */
    let filteredStudents = [];
    // boolean indicating whether to use .filter or not, we don't want to use any filtering, when e.target.value is blank,
    // in that case we just want to list all the students
    let useFilter = true;
    //if (e.target.value.length === "") { <--does not work, e.target.value is blank, but not empty string !!!
    if (e.target.value.length === 0) {
      filteredStudents = studentlist;
      useFilter = false;
    }
    /* if the user has already filtered by name, use the filtered name array filteredStudentsbyName
     as input for the next filter by tag*/
    if (filteredbyNameAlready) {
      filteredStudents = filteredStudentsbyName;
    } else {
      // else if user has not filtered by name yet, just use the existing studentlist
      filteredStudents = studentlist;
    }
    if (useFilter) {
      filteredStudents = filteredStudents.filter((student) => {
        // grab the tag property from each student and store it in variable called tag
        const { tag = [] } = student;
        // create a new map called tagName which just holds the name as a string for all the tags,
        // remember that tag is a object tag = {name: tag}
        const tagName = tag.map(({ name }) => name);
        // check if all the tags that the student has (tagName) include the user input(e.target.value)
        // ie if tagName =["tag1", "tag2"] and e.target.value is "tag1" , check if the arrary includes "tag1"
        return tagName.includes(e.target.value);
      });
    }
    //setFilteredStudentsbyNameAndTag(filteredStudents);
    setDisplayfilteredStudents(filteredStudents);
  };

  const toggleClass = (index) => {
    //console.log(activeIndex);
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const moreLess = (index) => {
    if (activeIndex === index) {
      return (
        <span>
          <i className="fas fa-angle-up" /> Less
        </span>
      );
    } else {
      return (
        <span>
          <i className="fas fa-angle-down" /> More
        </span>
      );
    }
  };

  return (
    <Fragment>
      <div className="inputFields">
        <input
          id="name-input"
          type="field"
          value={nameInput}
          onChange={handleNameChange}
          placeholder="Enter a Name"
        />

        <input
          id="tag-input"
          type="field"
          value={tagInput}
          onChange={handleTagChange}
          placeholder="Enter a Tag"
        />
      </div>
      {displayfilteredStudents &&
        displayfilteredStudents.map((student, index) => (
          <Fragment key={index}>
            <div className="imageAndText">
              <div className="imageDiv">
                <img
                  src={student.pic}
                  alt={student.firstName}
                  className="image"
                />{" "}
              </div>
              <div>
                <div className="name">
                  {" "}
                  {student.firstName.toUpperCase()}{" "}
                  {student.lastName.toUpperCase()}{" "}
                </div>
                <div>Email: {student.email} </div>
                <div>Company: {student.company} </div>
                <div>Skill: {student.skill} </div>
                <div>Average: {average(student.grades)}%</div>

                <Collapse isOpened={activeIndex === index}>
                  <div
                    className={classNames("alert alert-info msg", {
                      show: activeIndex === index,
                      hide: activeIndex !== index,
                    })}
                  >
                    {student.grades.map((grade, index) => (
                      <div key={index}>
                        Test{index + 1} {grade}%
                      </div>
                    ))}
                  </div>
                  <ChildTags
                    // pass student as props to ChildTags.js, consumed by handleAddtion method
                    // in ChildTags.js
                    student={student}
                    /* setTagFromChild is a method coming from Child component, 
                CHildTags.js, we use .bind(this, index) to bind the index parameter,
                so that when we call the method from the child component ChildTags.js,
                we don't need to specify the index.
                
                pass in the method seTagFromChild via props to the child component 
                ChildTags.js, at the time we pass this method to the child component, we already 
                have the index available through .bind(this, index), so that we don't need to pass
                it back to the parent later on. When the method gets called from ChildTags.js, 
                it will also supply the paramter student back to the parent.                
                */
                    setTagFromChild={setTagFromChild.bind(this, index)}
                  />
                </Collapse>
                <button
                  className="expand-btn"
                  // need to use arrow function or else we get infinite rerender
                  onClick={() => toggleClass(index)}
                >
                  {moreLess(index)}
                </button>
              </div>
            </div>
          </Fragment>
        ))}
    </Fragment>
  );
};

export default Studentlist;

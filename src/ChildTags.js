import React, { useState } from "react";
import ReactTags from "react-tag-autocomplete";

// Passing data from Parent studentlist to Child ChildTags via Props
// destructuring props from parent component studentlist, get the student and seTagFromChild function
const ChildTags = ({ student, setTagFromChild }) => {
  // if student.tag exists, grab the tags from the student and store it in
  // a state variable tags, if student.tag does not exists, assign tags a blank array
  const [tags, setTags] = useState(student.tag || []);

  // function for adding tags
  const handleAddition = (e) => {
    let newtags = [...tags, e];
    setTags(newtags);
    // grab all the tags from student and store it in tag, if student does not exists yet (onload)
    // assign a blank tag (ie tag = [])
    const { tag = [] } = student;
    // attach the tags that were entered by the user with the property newtags to newTagStudent,
    //  merge the 2 arrays, tag an array which holds the existing tags from parent and newtags,
    // the new tags that the user has just entered
    let newTagStudent = { ...student, tag: [...tag, ...newtags] };
    /* send newTagStudent to parent by calling method SetTagFromChild, which resides
    in the parent component Studentlist.js, we don't need to pass in the first parameter index here,
    because we have bound the index in the parent component Studentlist.js with the notation
    setTagFromChild={setTagFromChild.bind(this, index)}*/
    setTagFromChild(newTagStudent);
  };

  // function for deleting tags
  const handleDelete = (index) => {
    const newtags = tags.slice(0);
    newtags.splice(index, 1);
    setTags(newtags);
  };

  const reactTags = React.createRef();

  return (
    <div>
      <ReactTags
        tags={tags}
        ref={reactTags}
        onDelete={handleDelete}
        onAddition={handleAddition}
        allowNew={true} //need to add this to allow new tags to be added when user presses enter
        className="add-tag-input"
      />
    </div>
  );
};

export default ChildTags;

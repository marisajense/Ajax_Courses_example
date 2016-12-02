$(document).ready(function() {
  var $getCourses = $('#get-courses');
  var $courseForm = $('#add-course-form');
  // Grab data from page
  var $courseTitle = $('#course-title');
  var $courseCode = $('#course-code');
  var $courseDescription= $('#course-description');
  var $courseActive = $('#course-active');
  var $courses = $('#courses');
  var BASEURL = 'http://devpoint-ajax-example-server.herokuapp.com/api/v1'

  function loadCourses() {
    //Not loading duplicate data into the course list over again
    $courses.empty();

    $.ajax({
      type: 'GET',
      url: BASEURL + '/courses',
      dataType: 'JSON'
    }).success(function(data) {
      for (var i = 0; i < data.length; i++) {
        var course = data[i];
        $courses.append('<div id=' + course.id + '>' + course.title + ' - <button class="blue btn show-course"><i class="material-icons">visibility</i></button> <button class="orange btn edit-course"><i class="material-icons">edit</i></button> <button class="red btn delete-course"><i class="material-icons">delete</i></button> </div>');
      }
    }).fail(function(data) {
      console.log(data);
    });
  }

//--------------------EDIT BUTTON----------------//
  $(document).on('click', '.edit-course', function() {
    // Find the id of the course from the page
    var courseId = $(this).parent().attr('id');
    // make an ajax call to get the data of that course
    $.ajax({
      type: 'GET',
      url: BASEURL + '/courses/' + courseId,
      dataType: 'JSON'
    }).success(function(data) {
      // console.log(data); data.id data.description
      //                          .focus is making so it goes back up to the form if you edit something at bottom
      $courseTitle.val(data.title).focus();
      $courseCode.val(data.code);
      $courseDescription.val(data.description);
      // Makes it so check box is working correctly
      if(!data.active) {
        $courseActive.removeAttr('checked')
      } else{
        $courseActive.attr('checked', data.active);
      }
      // So it edits in the correct place when you submit
      $courseForm.data('course-id', courseId);
      // populates in the form for editing
    }).fail(function(data) {
      console.log(data);
    });
    // fill in the form on the page
    //make sure the form handles a PUT request.
  });

// ----------------SHOW BUTTON------------------//
  $(document).on('click', '.show-course', function() {
    var courseId = $(this).parent().attr('id');
    //find the id of the course from the page
    //make the ajax call to get the data of that course
    $.ajax({
      type:'GET',
      url: BASEURL + '/courses/' + courseId,
      dataType: 'JSON',
    }).success(function(data) {
      console.log('show')
      var course = data
      $courses.append("<div>" + course.title + " " + course.code + " " + course.description + course.active + "</div>")
    }).fail(function(data) {
      console.log(data);
    });
    //fill in some div on the page with the course info

  });

  //-----------------DELETE BUTTON------------------//
  //delete course button
  // ONLY for dynamic loaded elements (see line 18 delete button)
  // when elements are loaded after page load via Ajax
  $(document).on('click', '.delete-course', function() {
    // console.log('delete button clicked!'); -- did it respond?
    // Figure out how to find the couse id to delete - ---added course.id to div
    // console.log($(this).parent().attr('id')); - This is how we found the id
    var courseId = $(this).parent().attr('id');
    // ajax DELETE call with that course id
    $.ajax({
      type: 'DELETE',
      url: BASEURL + '/courses/' + courseId,
      dataType: 'JSON'
    }).success(function(data) {
      //div with an id of --- remove it
      $('#' + courseId).remove();
    }).fail(function(data) {
      //JS alert to the user
      // Show an error div and fill it with error data
      console.log(data);
    });
    // remove that course from the list, or reload the list
  });

  $courseForm.submit(function(e) {
    //Pass in e in function and e.prevent should always be first line if preventing default
    e.preventDefault();
    var requestType, requestUrl


    if($(this).data('course-id')) {
      requestType = 'PUT';
      requestUrl = BASEURL + '/courses/' + $(this).data('course-id');
    } else {
      requestType = 'POST';
      requestUrl = BASEURL + '/courses';
    }

    // console.log(this); -- shows that we are in the form! <form id=""....
    // Ajax POST request to the server with that data
    $.ajax({
      //(posting new course to server)
      type: requestType,
      url: requestUrl,
      dataType: 'JSON',
      //params.require(:course).permit(:title, :course etc..)
      data: {course: {title: $courseTitle.val(),
                      description: $courseDescription.val(),
                      code: $courseCode.val(),
                      active: $courseActive.val()
                      }}
    }).success(function(data) {
      // clear/reset the form
      // add the new course to the list
      // console.log($courseForm); -- jquery object @ 0
      //Resetting....
      $courseForm[0].reset();
      //Refocusing...
      $courseTitle.focus();
      // (add the new course to the list)
      loadCourses();
    }).fail(function(data) {
      console.log(data);
    });
    // Handle successes and errors
    // add the new course to the page on success
  });

  $getCourses.click(function() {
    loadCourses();
  });
});

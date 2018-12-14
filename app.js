var express = require("express"); // This line calls the express module
var app = express(); //invoke express application

var fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const fileUpload = require('express-fileupload');
app.use(fileUpload());

// we need some way for the app to know where to look
app.use(express.static("views"));
app.use(express.static("scripts"));
app.use(express.static("model"));
app.use(express.static("images"));


//allow access to the json file
var house = require("./model/house.json");
var comments = require("./model/comments.json");
const path = require('path'); 
const VIEWS = path.join(__dirname, 'views'); 

//------------------------------------------------
//Add comments referenced from Liam McCabe


app.post("/addcomment", function(req, res){
    
    // function to find the max id
    
  	function getMax(comments , id) {
		var max
		for (var i=0; i<comments.length; i++) {
			if(!max || parseInt(comments[i][id]) > parseInt(max[id]))
				max = comments[i];
			
		}
		return max;
	}
	
	
	var maxPpg = getMax(comments, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
    
	// create a new product based on what we have in our form on the add page 
	
	var commentsx = {
    username: req.body.username,
    id: newId,
    comment: req.body.comment
    
    
  };
    
     console.log(commentsx);
  var json = JSON.stringify(comments); // Convert our json data to a string
  
  // The following function reads the new data and pushes it into our JSON file
  
  fs.readFile("./model/comments.json", 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      comments.push(commentsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(comments, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile("./model/comments.json", json, 'utf8')
    }
    
  })
  res.redirect("/comments");
    
    
});

//-------------------------------------------------------------
//Comment Edit

app.get("/editcomment/:id", function(req, res){
    
   function chooseComment(indOne){
   return indOne.id === parseInt(req.params.id)
  
     }
 
  var indOne = comments.filter(chooseComment);
  
  //res.send(indOne)
  res.render("editcomments.ejs", {indOne});

    
});


// Create post request to edit the individual review - referenced from Liam McCabe
app.post('/editcomment/:id', function(req, res){
 var json = JSON.stringify(comments);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 //var data = contact; // declare data as the reviews json file
  var index = comments.map(function(comments) {return comments.id;}).indexOf(keyToFind)
 

 comments.splice(index, 1, {"username": req.body.username, "comment": req.body.comment, "id": parseInt(req.params.id)});
 json = JSON.stringify(comments, null, 4);
 fs.writeFile('./model/comments.json', json, 'utf8'); // Write the file back
 res.redirect("/comments");
});

//--------------------------------------------------referenced from Liam McCabe
// route to render contact info page 
app.post("/addhouse", function(req, res){
    
    // function to find the max id
    
  	function getMax(house , id) {
		var max
		for (var i=0; i<house.length; i++) {
			if(!max || parseInt(house[i][id]) > parseInt(max[id]))
				max = house[i];
			
		}
		return max;
	}
	
	
	var maxPpg = getMax(house, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
    
	var housesx = {
    Type: req.body.Type,
    id: newId,
    Description: req.body.Description,
    Address: req.body.Address,
    phoneNum: req.body.phoneNum,
    Email: req.body.Email,
    Contact: req.body.Contact,
    Image: req.body.Image
    
    
    
  };
    
     console.log(housesx);
  var json = JSON.stringify(house); // Convert our json data to a string
  
  // The following function reads the new data and pushes it into our JSON file
  
  fs.readFile('./model/house.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      house.push(housesx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(house, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./model/house.json', json, 'utf8')
    }
    
  })
  res.redirect("/houses");
    
    
});


//----------------------------------------------------------------------------
//Create the route as follows.

// render edit contact page 

app.get("/edithouse/:id", function(req, res){
    
   function chooseContact(indOne){
   return indOne.id === parseInt(req.params.id)
  
     }
 
  var indOne = house.filter(chooseContact);
  
  //res.send(indOne)
  res.render("edithouses.ejs", {house});

    
});


// Create post request to edit the individual review - referenced from Liam McCabe
app.post('/edithouse/:id', function(req, res){
 var json = JSON.stringify(house);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 //var data = contact; // declare data as the reviews json file
  var index = house.map(function(house) {return house.id;}).indexOf(keyToFind)
 

 house.splice(index, 1, {"Type": req.body.Type, "Description": req.body.Description, "id": parseInt(req.params.id), "Address": req.body.Address, "Contact": req.body.Contact, "Email": req.body.Email, "phoneNum": req.body.phoneNum});
 json = JSON.stringify(house, null, 4);
 fs.writeFile('./model/house.json', json, 'utf8'); // Write the file back
 res.redirect("/viewHomes");
});

////------------------------------------------------referenced from Liam McCabe
app.get("/deletehouse/:id", function(req, res){
    
  var json = JSON.stringify(house); // Convert our json data to a string
  
  var keyToFind = parseInt(req.params.id) // Getes the id from the URL
  var data = house; // Tell the application what the data is
  var index = data.map(function(d) {return d.id;}).indexOf(keyToFind)
  console.log("variable Index is : " + index)
  console.log("The Key you ar looking for is : " + keyToFind);
  
  house.splice(index, 1);
  json = JSON.stringify(house, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./model/house.json', json, 'utf8')
  res.redirect("/houses");
    
});
//------------------------------------------------------------------------------
// Route to render add contact info page
app.get("/addhouse", function(req, res){
    res.render("addhouse.ejs");
    console.log("On add contact page!");
    
});

// Post request for add cotact page
app.post("/addhouse", function(req, res){
    

    res.render("addhouse.ejs");
    console.log("On add contact page!");
    
});

//// Route to render index page 
app.get("/", function(req, res){
    
  
    res.render("index.ejs");
    console.log("Its true you know!");
    
});

// Route to render houses page
app.get("/houses", function(req, res){
    
   
    res.render("houses.ejs", {house});
    console.log("Its true you know!");
    
});

app.get("/reviews", function(req, res){
    
   
    res.render("reviews.ejs", {house});
    console.log("Its true you know!");
    
});

// Route to render contact info page
app.get("/viewHomes", function(req, res){
    

    res.render("viewHomes.ejs",{house});
    console.log("On the house list page!");
    
});

//Route to render comments page
app.get("/comments", function(req, res){
    
   
    res.render("comments.ejs", {comments});
    console.log("Comments page rendered");
    
});






//url to delete JSON
app.post("/deletehouse/:id", function(req, res){
    
});

// Image Uploader ------------------------------referenced from Liam McCabe

app.get('/upload', function(req, res) { // Call a get request when somebody visits the main url
    res.render('upload.ejs', {root:VIEWS});   // Sending a response which is just a string.
 
        
});




app.post('/upload', function(req, res) {
 if (!req.files)
  return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
 let sampleFile = req.files.sampleFile;
  filename = sampleFile.name;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./images/' + filename, function(err) {
    if (err)
      return res.status(500).send(err);
 console.log("Here is the image " + req.files.sampleFile)
    res.redirect('/upload');
  });
});



// Now we need to tell the application where to run
app.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  console.log("Off we go again");
  
});






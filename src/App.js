import "@aws-amplify/ui-react/styles.css";

import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
  Grid,
  TextField,
  Alert,
  ToggleButton,
  Flex,
  Badge,
  Text,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  ThemeProvider,
  Theme,
  TextAreaField,
  SelectField,
  SwitchField,
  useTheme,
  Divider
} from "@aws-amplify/ui-react";

import { Amplify, API, Storage } from 'aws-amplify';
import React, { useState, useEffect } from "react";
import TextareaAutosize from 'react-textarea-autosize';

function App({ signOut }) {
  const[cid, setCid] = useState('');
  const[timestamp, setTimestamp] = useState('');
  const[thand, setThand] = useState('');
  const[fname, setFname] = useState('');
  const[lname, setLname] = useState('');
  const[dob, setDob] = useState('');
  const[region, setRegion] = useState('');
  const[text, setText] = useState('');
  const[ir, setIr] = useState('');

  // For uploadImage
  async function onChange(e) {
    e.preventDefault();
    // If there are no files, return
    if (!e.target.files[0]) return
    // Set the variable file to the uploaded file
    const file = e.target.files[0];
    // Set the key for the file
    const imageKey = file.name;
    setIr(imageKey);
    // Log the key
    console.log(imageKey);
    // instantiate a request url
    var url = "https://ini5trtk7b.execute-api.us-west-2.amazonaws.com/v0/uploadimage/20220725s3bucket/image%2Fraw%2F" + imageKey
    console.log(url);
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "image/*");
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: file,
      redirect: "follow",
    };
    // make API call with parameters and use promises to get response
    fetch(
      url, requestOptions
    )
      .then((response) => response.text())
      .then((result) => alert(JSON.parse(result).body))
      .catch((error) => console.log("error", error));
    // alert('your file has been uploaded');
    // Show the user a preview
    document.getElementById('preview').src = window.URL.createObjectURL(file);
  }

  // For submitting the comment
  async function Comment(e) {
    e.preventDefault();
    console.log('Campaign ID: ' + cid,
                ', Timestamp: ' + timestamp,
                ', Twitter Handle: ' + thand,
                ', First Name: ' + fname,
                ', Last Name: ' + lname,
                ', Date of Birth: ' + dob,
                ', Region: ' + region,
                ', Text: ' + text,
                ', Image Reference: ' + ir);
    // If the comment doesn't include an image
    if(ir == ''){
      // instantiate a request url
      var jsonKey = cid + '_' + timestamp + '_' + thand + '.json'
      var url = "https://ini5trtk7b.execute-api.us-west-2.amazonaws.com/v2/submitcomment/20220725s3bucket/input%2F" + jsonKey
      console.log(url);
      // instantiate a headers object
      var myHeaders = new Headers();
      // add content type header to object
      myHeaders.append("Content-Type", "application/json");
      var data = JSON.stringify({ "userMetaData" : { campaign_id: cid, 
                                                    timestamp: timestamp,
                                                    twitter_handle: thand,
                                                    first_name: fname,
                                                    last_name: lname,
                                                    date_of_birth: dob,
                                                    region: region
                                                  },
                                  "data": { text: text } 
                                });
      // create a JSON object with parameters for API call and store in a variable
      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: data,
        redirect: "follow",
      };
      // make API call with parameters and use promises to get response
      await fetch(
        url, requestOptions
      )
        .then((response) => response.text())
        .then((result) => alert(JSON.parse(result).body))
        .catch((error) => console.log("error", error));
      // If the comment includes an image
      } else {
      // instantiate a request url
      var jsonKey = cid + '_' + timestamp + '_' + thand + '.json'
      var url = "https://ini5trtk7b.execute-api.us-west-2.amazonaws.com/v1/processimage/20220725s3bucket/input%2F" + jsonKey
      console.log(url);
      // instantiate a headers object
      var myHeaders = new Headers();
      // add content type header to object
      myHeaders.append("Content-Type", "application/json");
      var data = JSON.stringify({ "userMetaData" : { campaign_id: cid, 
                                                    timestamp: timestamp,
                                                    twitter_handle: thand,
                                                    first_name: fname,
                                                    last_name: lname,
                                                    date_of_birth: dob,
                                                    region: region
                                                  },
                                  "data": { text: text,
                                            image_reference: ir
                                          } 
                                });
      // create a JSON object with parameters for API call and store in a variable
      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: data,
        redirect: "follow",
      };
      // make API call with parameters and use promises to get response
      await fetch(
        url, requestOptions
      )
        .then((response) => response.text())
        .then((result) => alert(JSON.parse(result).body))
        .catch((error) => console.log("error", error));
    }
    setCid('');
    setTimestamp('');
    setThand('');
    setFname('');
    setLname('');
    setDob('');
    setRegion('');
    setText('');
    setIr('');
  }


  // For Gobjs
  const [gobjs, setGobjs] = useState([]);

  // Fetch the gobjs in the table
  async function fetchGobjs(){
    const headers = {
      "Content-Type": "application, json",
    }
    const apiResponse = await fetch('https://sku06p2ar3.execute-api.us-west-2.amazonaws.com/v0/read', {headers} )
    const apiResponseJSON = await apiResponse.json()
    const gs = apiResponseJSON.body
    // console.log(apiResponseJSON)
    console.log(gs)
    setGobjs([...gs])
  }
  // Fetch the gobjs in the table: UseEffect
  useEffect(() => { 
    async function fetc(){
      const headers = {
        "Content-Type": "application, json",
      }
      const apiResponse = await fetch('https://sku06p2ar3.execute-api.us-west-2.amazonaws.com/v0/read', {headers} )
      const apiResponseJSON = await apiResponse.json()
      const gs = apiResponseJSON.body
      // console.log(apiResponseJSON)
      console.log("This is gs: " + gs)
      setGobjs([...gs])
    }
    fetc()
  }, []);

  // Table Theme
  const theme: Theme = {
    name: "table-theme",
    tokens: {
      components: {
        table: {
          row: {
            hover: {
              backgroundColor: { value: "{colors.blue.20}" },
            },
            striped: {
              backgroundColor: { value: "{colors.blue.10}" },
            },
          },
          header: {
            color: { value: "{colors.blue.80}" },
            fontSize: { value: "{fontSizes.xl}" },
          },
          data: {
            fontWeight: { value: "{fontWeights.semibold}" },
          },
        },
      },
    },
  };
  const { tokens } = useTheme();

  // For showing the history
  const [stretch, setStretch] = useState(false);
  async function changeStretch(){
    setStretch(!stretch);
    fetchGobjs();
  }


  return (
    <>
      <Card
        columnStart="1"
        columnEnd="-1"
      >
       <Heading level={1}>Nautilus Marketing: Detecting Sentiment</Heading> 
      </Card>

      <br/>
      <div className='mainContent'>
        {/* Upload Image */}
        <div className='uploadDiv'>
        
        {/* Inputs */}
        <form onSubmit={Comment}>

            <View>
            <Heading level={4}>Social Media Comment Creator</Heading> 
            <br/>

            <Heading level={4}>Comment Text</Heading> 
            <div className='formDiv'>
              {/* Text */}
              <TextareaAutosize
                  className='responsiveTA input'
                  placeholder="Text"
                  onChange={e => setText(e.target.value)}
                  value={text}
                />
            </div>
            <Heading level={4}>Comment Image (Optional)</Heading> 

            <div>
              <img id="preview" alt="your image" width="350" height="350" src="imageupload.jpeg"/>
              <input
              type="file"
              onChange={onChange}
              className='fileInput'
              />
            </div>

            <br/>
            <br/>
            <Heading level={4}>Configure Comment Metadata</Heading> 
            <div className='formDiv'>
              {/* Campaign ID */}
              <input
                required
                className='input'
                onChange={e => setCid(e.target.value)}
                placeholder="Campaign ID"
                value={cid}
              />
            </div>
            <div className='formDiv'>
              {/* Timestamp */}
              <input
                // required
                className='input'
                onChange={e => setTimestamp(e.target.value)}
                placeholder="Timestamp"
                value={timestamp}
              />
            </div>
            <div className='formDiv'>
              {/* Twitter Handle */}
              <input
                required
                className='input'
                onChange={e => setThand(e.target.value)}
                placeholder="Twitter Handle"
                value={thand}
              />
            </div>
            <div className='formDiv'>
              {/* First Name */}
              <input
                required
                className='input'
                onChange={e => setFname(e.target.value)}
                placeholder="First Name"
                value={fname}
              />
            </div>
            <div className='formDiv'>
              {/* Last Name */}
              <input
                required
                className='input'
                onChange={e => setLname(e.target.value)}
                placeholder="Last Name"
                value={lname}
              />
            </div>
            <div className='formDiv'>
              {/* Date of Birth */}
              <input
                required
                className='input'
                onChange={e => setDob(e.target.value)}
                placeholder="Date of Birth"
                value={dob}
              />
            </div>
            <div className='formDiv'>
              {/* Region */}
              <input
                required
                className='input'
                onChange={e => setRegion(e.target.value)}
                placeholder="Region"
                value={region}
              />
            </div>

            {/* Submit button */}
            <div className='formDiv'>
              <Button type='submit'>Analyze</Button>
            </div>
          </View>

        </form>



        {/* Show Stretch */}
        <div className='showHistory'>
          <Button className='signOut' onClick={() => changeStretch()}>{stretch? (<>HIDE HISTORY</>):(<>SHOW HISTORY</>)}</Button>
          {/* <SwitchField
            label={stretch? (<>HIDE HISTORY</>):(<>SHOW HISTORY</>)}
            // labelPosition="start"
            value='test'
            onChange={() => setStretch(!stretch)}
          /> */}
        </div>

          {stretch? (<>
          <div className='tableDiv'>
            <ThemeProvider theme={theme} colorMode="light">
              <Table highlightOnHover variation="striped">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Campaign ID
                    </TableCell>
                    <TableCell>
                      Timestamp
                    </TableCell>
                    <TableCell>
                      Twitter Handle
                    </TableCell>
                    <TableCell>
                      Text
                    </TableCell>
                    <TableCell>
                      Sentiment
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                {     
                  (gobjs.length > 0)?  
                  (
                    gobjs.map((gobj) => (
                    <>
                    <TableRow key={gobj.id}>
                      <TableCell>
                        {gobj.Campaign_ID}
                      </TableCell>
                      <TableCell>
                        {gobj.Timestamp}
                      </TableCell>
                      <TableCell>
                        {gobj.Twitter_Handle}
                      </TableCell>
                      <TableCell>
                        {gobj.Text}
                      </TableCell>
                      <TableCell>
                        {gobj.Sentiment}
                      </TableCell>
                    </TableRow>
                    </>
                  ))) :
                  (<></>)
                }
                </TableBody>
            </Table>
            </ThemeProvider>
          </div>
          </>): (<></>)}
          

        <div className='signOut'>
          <Button onClick={signOut}>Sign Out</Button>
        </div>

      </div>
    
      </div>
   

    </>


  );
}

export default withAuthenticator(App);
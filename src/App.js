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
  Divider,
  ToggleButton,
  TabItem,
  Tabs
} from "@aws-amplify/ui-react";

import { Amplify, API, Auth, Hub, Storage } from 'aws-amplify';
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

  const[image, setImage] = useState(false);
  async function changeImage(){
    setImage(!image);
  }
  
  // For uploadImage
  async function onChange(e) {
    e.preventDefault();
    // To set the optional warning
    changeImage();
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
    var url = "https://huarvr0fal.execute-api.us-west-2.amazonaws.com/v1/uploadimage/20220731s3bucket/image%2Fraw%2F" + imageKey
    console.log(url);
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "image/*");
    myHeaders.append("x-api-key", "LC2BLXB9VR31v5e71FWb38AGWmxUkWEz4NxQLX1K");
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
      var url = "https://huarvr0fal.execute-api.us-west-2.amazonaws.com/v4/submitcomment/20220731s3bucket/input%2Ftext%2F" + jsonKey
      console.log(url);
      // instantiate a headers object
      var myHeaders = new Headers();
      // add content type header to object
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-api-key", "LC2BLXB9VR31v5e71FWb38AGWmxUkWEz4NxQLX1K");
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
      var url = "https://huarvr0fal.execute-api.us-west-2.amazonaws.com/v4/processimage/20220731s3bucket/input%2Ftext%2F" + jsonKey
      console.log(url);
      // instantiate a headers object
      var myHeaders = new Headers();
      // add content type header to object
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-api-key", "LC2BLXB9VR31v5e71FWb38AGWmxUkWEz4NxQLX1K");
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

  const [records, setRecords] = useState([]);


  // Fetch the records in the table
  async function fetchRecords(){
    const headers = {
      "Content-Type": "application, json",
    }
    const apiResponse = await fetch('https://huarvr0fal.execute-api.us-west-2.amazonaws.com/v5/read', {headers} )
    const apiResponseJSON = await apiResponse.json()
    const rs = apiResponseJSON.body
    console.log(rs)
    setRecords([...rs])
  }
  // Fetch the records in the table: UseEffect
  useEffect(() => { 
    async function fetchRecords(){
      const headers = {
        "Content-Type": "application, json",
      }
      const apiResponse = await fetch('https://huarvr0fal.execute-api.us-west-2.amazonaws.com/v5/read', {headers} )
      const apiResponseJSON = await apiResponse.json()
      const rs = apiResponseJSON.body
      console.log("This is rs: " + rs)
      setRecords([...rs])
    }
    fetchRecords()
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
    fetchRecords();
  }

  // For autogenerating timestamp
  const [autotime, setAutotime] = useState(false);
  async function changeAutotime(){
    setAutotime(!autotime);
  }

  // For tabs
  const [index, setIndex] = useState(0);

  return (
    <>
      <Card
        columnStart="1"
        columnEnd="-1"
        style={{backgroundColor: 'black'}}
      >
       <Heading level={1} style={{color: 'white'}} ><b>Nautilus Marketing</b> <br/> Detecting Sentiment</Heading> 
      </Card>

      <br/>
      <div className='mainContent'>


        <div id='commentAnalyzer'>
        
        {/* Inputs */}
        <form onSubmit={Comment}>

            <View>
            <Heading level={3}>Social Media Comment Analyzer</Heading> 
            <br/>

              <Tabs currentIndex={index} onChange={(i: number) => setIndex(i)}>
              <TabItem title="Comment">
              <br/>
              <Heading level={4}><i>Comment Text</i></Heading> 
                <div className='formDiv'>
                  {/* Text */}
                  <TextareaAutosize
                      className='responsiveTA input'
                      placeholder="Input your comment text here..."
                      onChange={e => setText(e.target.value)}
                      value={text}
                    />
                </div>
                <Heading level={4}><i>Comment Image</i></Heading>
                <img id="preview" alt="your image" width="350" height="350" src="imageupload.jpeg"/>
                <div>
                  {image? (<></>):(<>
                  <Badge variation='info' size='large'>
                    Note: Uploading an Image is Optional
                  </Badge></>)}
                  <input
                  type="file"
                  onChange={onChange}
                  className='fileInput'
                  />
                </div>
              </TabItem>
              <TabItem title="Metadata">
              <br/>
              <Heading level={4}><i>Configure Comment Metadata</i></Heading> 
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
                <ToggleButton onClick={() => changeAutotime()}>
                  {!autotime? (<>
                    Click Here To Use Automatic Timestamp
                  </>):(<>Automatic Timestamp</>)}
                </ToggleButton>
              </div>
              {!autotime? (<>
                <div className='formDiv'>
                {/* Timestamp */}
                <input
                  className='input'
                  onChange={e => setTimestamp(e.target.value)}
                  placeholder="Timestamp"
                  value={timestamp}
                />
              </div>
              </>):(<></>)} 
            
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
                <Button type='submit' variation='primary' size="large">Analyze Comment</Button>
              </div>

                <Button isFullWidth onClick={() => setIndex(0)}>
                  Edit Comment
                </Button>
              </TabItem>
            </Tabs>


            
            <br/>
            <br/>
            <Button onClick={signOut} style={{backgroundColor: 'pink'}} isFullWidth size='large'>Sign Out</Button>
          </View>
        </form>
        </div>
        
        <Divider/>

        {/* Show Stretch */}
        <div className='showHistory'>
          <Button className='signOut' 
                  style={{backgroundColor: 'green', color: 'white'}} 
                  size="large" onClick={() => changeStretch()}>
            {stretch? (<>Hide Historical Sentiment</>):(<>Show Historical Sentiment</>)}
          </Button>
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
                  (records.length > 0)?  
                  (
                    records.map((record) => (
                    <>
                    <TableRow key={record.id}>
                      <TableCell>
                        {record.Campaign_ID}
                      </TableCell>
                      <TableCell>
                        {record.Timestamp}
                      </TableCell>
                      <TableCell>
                        {record.Twitter_Handle}
                      </TableCell>
                      <TableCell>
                        {record.Text}
                      </TableCell>
                      <TableCell>
                        {record.Sentiment}
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
          {/* <Button onClick={signOut} style={{backgroundColor: 'pink'}} isFullWidth size='large'>Sign Out</Button> */}
        </div>
      </div>
   
    </>


  );
}

export default withAuthenticator(App);
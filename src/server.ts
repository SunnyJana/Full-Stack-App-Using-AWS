import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { isUri } from 'valid-url';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url: imageUrl } = req.query + res.url;
    if (!imageUrl || !isUri(imageUrl)) {
      return res.status(400).send({ auth: false, message: 'Image url is missing or malformed' });
    }

    const filteredPath = await filterImageFromURL(imageUrl);

    res.sendFile(filteredPath, {}, () => deleteLocalFiles([filteredPath]));
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
    // Starting the express
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
  
})();

const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});

const http = require(`http`);
const url = require(`url`);
const fs = require(`fs`);
const {promisify} = require(`util`);

const HOSTNAME = `127.0.0.1`;
const PORT = 3000;

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);

const printDirectory = (path, relativePath, files) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Directory content</title>
</head>
<body>
<ul>
    ${files.map((it) => `<li><a href="${relativePath}/${it}">${it}</a></li>`).join(``)}
</ul>
</body>
</html>`;
};

const readFile = async (path, res) => {
  const data = await readfile(path);
  res.setHeader(`content-type`, `text/plain`);
  res.end(data);
};


const readDir = async (path, relativePath, res) => {
  const files = await readdir(path);
  res.setHeader(`content-type`, `text/html`);
  res.end(printDirectory(path, relativePath, files));
};

const server = http.createServer((req, res) => {

  const localPath = url.parse(req.url).pathname;
  const absolutePath = __dirname + '/static/' + localPath;

  (async () => {
    try {
      const pathStat = await stat(absolutePath);
      console.log(pathStat);

      res.statusCode = 200;
      res.statusMessage = `OK`;

      if (pathStat.isDirectory()) {
        await readDir(absolutePath, localPath, res);
      } else {
        await readFile(absolutePath, res);
      }
    } catch (e) {
      res.writeHead(404, `Not Found`);
      res.end();
    }
  })().catch((e) => {
    res.writeHead(500, e.message, {
      'content-type': `text/plain`
    });
    res.end(e.message);
  });
});

server.listen(PORT, HOSTNAME, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server running at http://${HOSTNAME}:${PORT}`);
});

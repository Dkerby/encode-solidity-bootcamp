var express = require('express');
var router = express.Router();
const all = require('it-all');

// GET data from IPFS
router.get('/:cid', async function(req, res, next) {

    let runAsync = async () => {
        // Store CID in a variable
        const cid = req.params.cid;
        // Retrieve data from CID
        const data = Buffer.concat(await all(IPFS.cat(cid)));
        // Print data to console
        console.log(data.toString());
        res.send(data.toString());
    }

    runAsync().catch(next);
});

// POST data to IPFS
router.post('/', async function(req, res, next) {

    let runAsync = async () => {
        // Submit data to the network
        const cid = await IPFS.add(req.body.data);
        // Log CID to console
        console.log(cid.path);
        res.send(
            {
                cid: cid.path
            }
        );
    }

    runAsync().catch(next);
});

module.exports = router;
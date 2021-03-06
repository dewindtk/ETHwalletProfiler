const ethers = require('ethers');
const fs = require("fs")

// Convert Epoch to Time
function getTime(epoch)
{
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(epoch)
    return d
}

// Yield function for tx processing
function* txIterator(data)
{
    for (let i = 0;i<data.length;i++)
    {
        yield data[i];
    }

}

//Listen for Key pressed (for debugging)
const keypress = async () => 
{
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', data => {
      const byteArray = [...data]
      if (byteArray.length > 0 && byteArray[0] === 3) {
        console.log('^C')
        process.exit(1)
      }
      process.stdin.setRawMode(false)
      resolve()
    }))
}

function findIndex2Exclude(arr, stamp) // BRO pls make this more efficient ffs
{
    i = 0
    console.log(arr)
    while(i<arr.length && arr[i].timeStamp < stamp)
    {
        i++ ;
    }
    return i
}


function bigNum2Float(bignum, deci)
{
    return parseFloat(bignum.toString())/parseFloat((ethers.BigNumber.from(10).pow(parseInt(deci))).toString())
}

async function saveInv(wname, addy, timeStamp, pETHInv, pERC20Inv, pERC721Inv, pERC1155Inv)
{
    res = "Wallet: " + wname + "\n" + "Address: " + addy + "\n\n"
    res += "----- Your inventory on the " + getTime(timeStamp).toString() + " -----\n\n"
    res += "Ethereum: " + pETHInv.toString() + "\n\n"
    res += "                       --------------------------------------------- \n\n"
    res += "ERC20 Inventory: " + JSON.stringify(pERC20Inv, null, 2) + "\n\n"
    res += "                       --------------------------------------------- \n\n"
    res += "ERC721 Inventory: " + JSON.stringify(pERC721Inv, null, 2) + "\n\n"
    res += "                       --------------------------------------------- \n\n"
    res += "ERC1155 Inventory " + JSON.stringify(pERC1155Inv, null, 2) + "\n\n"
    res += "                       --------------------------------------------- \n\n"

    await fs.promises.writeFile(`./WALLET_${wname}_${timeStamp}.txt`, res, (err) => {
        if (err) {
            throw err;
        }
    });
    return 0

}

module.exports = {
    getTime, 
    txIterator, 
    keypress, 
    findIndex2Exclude,
    bigNum2Float,
    saveInv
};
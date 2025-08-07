
window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
    } else {
        alert("Please install MetaMask.");
    }

    const contractAddress = "YOUR_CONTRACT_ADDRESS";
    const abi = [/* Contract ABI here */];

    const contract = new web3.eth.Contract(abi, contractAddress);

    const candidates = await contract.methods.candidates().call();
    const container = document.getElementById("candidateList");
    candidates.forEach(candidate => {
        const btn = document.createElement("button");
        btn.innerText = `Vote for ${candidate}`;
        btn.onclick = async () => {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.vote(candidate).send({ from: accounts[0] });
            alert("Vote casted!");
        };
        container.appendChild(btn);
    });
});

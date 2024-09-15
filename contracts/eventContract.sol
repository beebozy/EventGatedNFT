//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
contract  Event{
    IERC721 public token;
    address public owner;
    uint public eventNumbers;
    uint public  attendeeNumber;
    struct Events{
        string name;
        bool isCreated;
        address acceptableAdresses;
}
constructor(){
    owner=msg.sender;
}



Events[] public events;
// When we register we should have a kind of erc721 address 
//events EventsRegistered(address indexed token, uint eventNumber);
mapping(address => mapping(uint => bool)) public acceptableAddresses;
//mapping(address=>Events)
//mapping(address=>eventNumbers)getEventNumbers;
function onlyOwner()private view{
    require(owner==msg.sender,"Not an owner");
}
event EventRegistered(address indexed token, uint eventNumber);

event EVentBooked(address indexed attendee, uint attendeeNumber);
event EventRemoved(address indexed nft, uint eventNumber);
function createEvent(address nftAdress, string memory _name)external{
    onlyOwner();
    

   // require(msg.sender!=address(0),"Not a valid initiator");
   require(nftAdress!=address(0),"Can't be a valid token");
    
        // ;
        uint countEvent=eventNumbers+1;
        acceptableAddresses[nftAdress][countEvent]=true;
        //getEventNumbers[nftAddress]=countEvent;
        eventNumbers=countEvent;
        events.push(Events(_name,true,nftAdress));
    emit EventRegistered(nftAdress,countEvent);
    
    
   
}
function registerEvent(address nftAddressOfAttendee)external{

require(nftAddressOfAttendee!=address(0),"Not in the pool");
require(token.balanceOf(nftAddressOfAttendee)>0,"You must have an ERC721");
require(acceptableAddresses[nftAddressOfAttendee][eventNumbers]==true,"Your address must be in the pool");
require(attendeeNumber<=5 && acceptableAddresses[nftAddressOfAttendee][eventNumbers],"Attendee cannot exceed the no");

emit EVentBooked(nftAddressOfAttendee, attendeeNumber++);
}
function removeEvent(address nftAddress)external{
require(nftAddress!=address(0),"Zero address not allowed");
require(acceptableAddresses[nftAddress][eventNumbers]==true,"The address is not here");
acceptableAddresses[nftAddress][eventNumbers]==false;
emit EventRemoved(nftAddress,eventNumbers);
}
}
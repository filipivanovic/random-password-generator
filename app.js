$(document).ready(function(){




// all characters 
const lettersLower = 'abcdefghijklmnopqrstuvwxyz';
const lettersUpper = lettersLower.toUpperCase();
const numbers = '1234567890';
const specialChars = ' !"#$%&\'()*+,-.:;/@[\\]^_`{|}~?>=';



// put items in checkbox values //default values     
(function defaultSetup(){
	$('#lowerLetters').val(lettersLower).prop('checked', true);
	$('#upperLetters').val(lettersUpper).prop('checked', true);
	$('#numbers').val(numbers).prop('checked', true);
	$('#specialCharacters').val(specialChars).prop('checked', false);
	$('#easierToRemember').prop('checked', false);
	$('#noRepeat').prop('checked', true);
	$('#passLength').val(12);
	$('#passLenOutput').text($('#passLength').val());
	$('#output').val('');
})();


const checkboxes = $('.checkboxes:not(#noRepeat, #easierToRemember)');
//make array of characters (checked values)
let a = function(){
	let charsInput = [];
	$('.checkboxes:not(#noRepeat, #easierToRemember):checked').each(function() {
		charsInput.push($(this).val());
	});
	return charsInput;
}
a();
checkboxes.on('change', a)




let easier;
function easy(){

	if($('#easierToRemember').prop('checked')){
		$('#q').after('<input id="easy" type="text" maxlength="29">');
		$('#meaning').css('display', 'block');
		easier = true;

	}else{
		$('#easy').remove();
		$('#meaning').css('display', 'none');
		easier = false;
	}

}
$('#easierToRemember').on('change', easy);



function getRand(len, items, noRepeat){
	let rand = [];
	let item = Array.from(items);
	let itemLen = item.length;

	for(let i = 0; i < len; i++){
		let randIndex = Math.floor(Math.random() * item.length);
		rand.push(item[randIndex])
		
		if(noRepeat){
			if(len < itemLen){
				item.splice(randIndex, 1);
			}
		}
	}
	return rand.join('');
}


//put custom letters that will be wrapped with random chars
function easierToRemember(item, itemToPut) {
	let returnVal = Array.from(item);
	
	if(itemToPut != undefined) {
		if(item.length > itemToPut.length) {
			returnVal.splice(0, itemToPut.length);
			let start = Math.floor(returnVal.length / 2);
			returnVal.splice(start, 0, itemToPut);
		}else {
			return returnVal = 'You think you are smart, hm?';
		}

		return returnVal.join('');
	}else {
		return returnVal = 'Error';
	}
	
	
}


function generate(passLen, noRepeat, easier, itemArr){
		
	let returnVal = [];
	let everyItem = Math.floor(passLen / itemArr.length);
	//get equal number of elements from each item from picked values
	let rest = passLen % itemArr.length;
	if(rest > 0){
		for(let i = 0; i < rest; i++){
			let rand = Math.floor(Math.random() * itemArr[i].length);
			returnVal.push(itemArr[i][rand])
		}

	}

	itemArr.map( item => returnVal.push(getRand(everyItem, item, noRepeat)));

	returnVal = returnVal.join('');

	returnVal = getRand(returnVal.length - 1, returnVal, noRepeat);

	if(easier) returnVal = easierToRemember(returnVal, $('#easy').val());

	return returnVal;
}


function copyPass(){
	let output = document.getElementById('output');
	if(output.value !== '') {
		output.select();
		document.execCommand('Copy');
		alert("Password copied to clipboard!");
	}
}

$('#copy').on('click', copyPass);

let noRepeat = $('#noRepeat').prop('checked');
$('#noRepeat').on('change', () => noRepeat = !noRepeat);

$('#passLength').on('input', () => $('#passLenOutput').text($('#passLength').val()));

let passLen = 	$('#passLength').val();
$('#passLength').on('change', (e) => passLen = $(e.target).val());

$('#clear').on('click', () => $('#output').val(''));


$('#generate').on('click', () => {
	$('#output').val(generate(passLen, noRepeat, easier, a()));;
	$('#output').val() === '' && $('#output').val('why would you do that?');
});


});

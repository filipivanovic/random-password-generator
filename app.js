$(document).ready(function(){




// all characters 
const lettersLower = 'abcdefghijklmnopqrstuvwxyz';
const lettersUpper = lettersLower.toUpperCase();
const numbers = '1234567890';
const specialChars = ' !"#$%&\'()*+,-.:;/@[\\]^_`{|}~?>=';
// character "<" removed from list because it causes the bug for some reaseon(?)



// put items in checkbox values //default values     
function defaultSetup(){
	$('#lowerLetters').val(lettersLower).prop('checked', true);
	$('#upperLetters').val(lettersUpper).prop('checked', true);
	$('#numbers').val(numbers).prop('checked', true);
	$('#specialCharacters').val(specialChars).prop('checked', false);
	$('#easierToRemember').prop('checked', false);
	$('#neighbour').prop('checked', false);
	$('#passLength').val(12);
	$('#easy').remove();
	$('#meaning').css('display', 'none');
	$('#passLenOutput').text($('#passLength').val());
	$('#output').empty();
}
defaultSetup();
$('#default').on('click', defaultSetup);



const checkboxes = $('.checkboxes:not(#neighbour, #easierToRemember)');
//make array of characters (checked values)
let a = function(){
	let charsInput = [];
	$('.checkboxes:not(#neighbour, #easierToRemember):checked').each(function() {
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
easy()
$('#easierToRemember').on('change', easy);


//get random with custom word and length
function getRand(len, items){
	let rand = [];
	let item = Array.from(items);
	
	for(let i = 0; i < len; i++){
		let temp = Math.floor(Math.random() * item.length);
		rand.push(item[temp]);
		item.splice(temp, 1); // prevent repeating
	}

	if(len > item.length){
		let lenDiff = len - items.length;
		rand.push(getRand(lenDiff, items))
	}

	rand = rand.join('');
	return rand;
}

//replace adjacent if equal
function neighbourLetter(item){
	let neigh = [];
	for(let i = 0; i < item.length; i++){
		neigh.push(item[i])
		while(neigh[i] == neigh[i - 1] || neigh[i] == neigh[i + 1]){
			neigh.pop();
			neigh.push(getRand(1, item))
		}
	}
	neigh = neigh.join('')
	return neigh;
}

//put custom letters that will be wrapped with random chars
function easierToRemember(item, itemToPut){
	if(item.length > itemToPut.length){
			if(itemToPut != undefined){
			itemToPut = Array.from(itemToPut);
			item = getRand(item.length, item) // randomize
			item = Array.from(item);

			let start = Math.floor((item.length - itemToPut.length) / 2);
			let end = itemToPut.length;
			item.splice(start, end, itemToPut);
			for(let i in item){
				if(item[i].constructor === Array){
					item[i] = item[i].join('');
				}
			}
			item = item.join('');
		}
	}else{
		item = 'You think you are smart, hm?';
	}

	return item;
	
}

// generate for output
function generate(passLen, neighbour, easier, itemArr){
		
		let arr = [];
		let everyItem = Math.floor(passLen / itemArr.length);

		//get equal number of elements from each item from itemArr
		let rest = passLen % itemArr.length;
		if(rest > 0){
			for(let i = 0; i < rest; i++){
				arr.push(getRand(1, itemArr[Math.floor(Math.random() * (itemArr.length))]));
			}
		}

		for(let i = 0; i < itemArr.length; i++){
			arr.push(getRand(everyItem, itemArr[i]));
		}


		arr = arr.join('');
		arr = getRand(arr.length, arr)

		if(neighbour === true) arr = neighbourLetter(arr);

		if(easier === true) arr = easierToRemember(arr, $('#easy').val());

		while(arr.length < passLen && arr.length != 0) {
			generate(passLen, neighbour, easier, itemArr);
		}

	return arr;

}


let neighbour = $('#neighbour').prop('checked');
$('#neighbour').on('change', function(){
	neighbour = !neighbour
});

$('#passLength').on('input', function(){
	$('#passLenOutput').text($('#passLength').val());
});

let passLen = 	$('#passLength').val();
$("#passLength").on("change", function(){
    passLen = $(this).val()
});

$('#clear').on('click', function(){
	$('#output').empty();
});


$('#generate').on('click', function(){
	let count = 0;
	for(let i of checkboxes){
		if($(i).prop('checked') === false) {
			count++;
			if(count === 4){
				$('#output').text('Why would you do that?')
			}else{
				$('#output').empty().text(generate(passLen, neighbour, easier, a()));
			}
		}
	}
	
});











});

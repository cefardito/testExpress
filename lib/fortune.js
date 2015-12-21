var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "El agua blanda acaba con la piedra dura.",
    "Cuando no sale el sol, el viento seca la ropa.",
    "No hay que gastar el dinero en lo superfluo."
];

exports.getFortune = function ()
	{
		var idx = Math.floor(Math.random() * fortuneCookies.length);
		return fortuneCookies[idx];
	};
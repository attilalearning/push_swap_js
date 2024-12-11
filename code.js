Array.prototype.setName = function (stack_name, stack_short_name) {
	this.name = stack_name;
	this.short_name = stack_short_name;
}

Array.prototype.rot = function (repeat) {
	if (this.length < 2)
		return ;
	if (this.length == 2)
		this.swp();
	else {
		if (!repeat)
			repeat = 1;
		while (repeat--) {
			this.push(this.shift());
			post_process_op(this, null, op.ROT);
		}
	}
}

Array.prototype.rrot = function (repeat) {
	if (this.length < 2)
		return ;
	if (this.length == 2)
		this.swp();
	else {
		if (!repeat)
			repeat = 1;
		while (repeat--) {
			this.unshift(this.pop());
			post_process_op(this, null, op.RROT);
		}
	}
}

Array.prototype.swp = function () {
	if (this.length < 2)
		return ;
	let first = this[0];
	this[0] = this[1];
	this[1] = first;
	post_process_op(this, null, op.SWP);
}

Array.prototype.p = function (to_array, repeat) {
	let elem;

	if (!Array.isArray(to_array))
		return ;
	if (!repeat)
		repeat = 1;
	if (this.length < 1)
		return ;
	while (repeat-- && this.length) {
		to_array.unshift(this.shift());
		post_process_op(this, to_array, op.PS);
	}
}

Array.prototype.top = function () {
	if (this.length < 1)
		return (null);
	return (this[0]);
}

Array.prototype.btm = function () {
	if (this.length < 1)
		return (null);
	return (this[this.length - 1]);
}

Array.prototype.min = function () {
	let i;
	let minim;

	i = 0;
	minim = this[i];
	while (i < this.length)
	{
		if (this[i] < minim)
			minim = this[i];
		i++;
	}
	return (minim);
}

Array.prototype.max = function () {
	let i;
	let maxim;

	i = 0;
	maxim = this[i];
	while (i < this.length)
	{
		if (maxim < this[i])
			maxim = this[i];
		i++;
	}
	return (maxim);
}

Array.prototype.toStr = function() {
	let i;
	let str;

	str = "";
	i = 0;
	str = "[ ";
	while (i < this.length) {
		str += this[i];
		i++;
		if (i < this.length)
			str += ", ";
	}
	str += " ]";
	return (str);
}

Array.log = function(arr1, arr2) {
	let str;

	if (Array.isArray(arr1)) {
		str = "";
		str += arr1.name + ": " + arr1.toStr();
	}
	if (Array.isArray(arr2)) {
		if (str != "")
			str += "\r\n";
		str += arr2.name + ": " + arr2.toStr();
	}
	return (str);
}

function post_process_op(stack_from, stack_to, operation) {
	let str;

	if (operation == op.PS) {
		str = "P" + stack_to.short_name;
	} else {
		if (operation == op.ROT)
			str = "R";
		else if (operation == op.RROT)
			str = "RR";
		else if (operation == op.SWP)
			str = "S";
		str += stack_from.short_name;
	}
	operationsStack.push(op[str]);
	log_op(str);
}


op = Object;
op.RA = 1;
op.RB = 2;
op.RRA = 3;
op.RRB = 4;
op.SA = 5;
op.SB = 6;
op.PA = 7;
op.PB = 8;
op.RR = 9;
op.RRR = 10;
op.SS = 11;
op.ROT = -100;
op.RROT = 100;
op.SWP = 200;
op.PS = 300;

let opposite = [];
opposite[op.PA] = op.PB;
opposite[op.PB] = op.PA;
opposite[op.RA] = op.RRA;
opposite[op.RB] = op.RRB;
opposite[op.RRA] = op.RA;
opposite[op.RRB] = op.RB;
opposite[op.SA] = op.SA;
opposite[op.SB] = op.SB;

let a = [];
let b = [];
let operationsStack = [];
let resumeOperations = [];
let undoOperations = [];
let push_swap_debug = false;
let total_number_count = 0;


op.toStr = function(operation) {
	if (typeof(operation) == "number")
		return (op.toStr_number(operation));
	else if (Array.isArray(operation))
		return (op.toStr_array(operation));
}
op.toStr_number = function(op_number) {
	let str = [ "N/A", "RA", "RB", "RRA", "RRB", "SA", "SB", "PA", "PB",
		"RR", "RRR", "SS" ];
	str[op.ROT] = "ROT";
	str[op.RROT] = "RROT";
	str[op.SWP] = "SWP";
	str[op.PS] = "PS";
	return (str[op_number]);
}
op.toStr_array = function(op_array) {
	let i;
	let str;

	i = 0;
	str = "";
	while (i < op_array.length) {
		if (i > 0 && i < op_array.length)
			str += " ";
		str += op.toStr_number(op_array[i]);
		i++;
	}
	return (str);
}

op.do_number = function(operation, stack1, stack2) {
	if (operation == op.RA)
		stack1.rot();
	else if (operation == op.RB)
		stack2.rot();
	else if (operation == op.RRA)
		stack1.rrot();
	else if (operation == op.RRB)
		stack2.rrot();
	else if (operation == op.SA)
		stack1.swp();
	else if (operation == op.SB)
		stack2.swp();
	else if (operation == op.PA)
		stack2.p(stack1);
	else if (operation == op.PB)
		stack1.p(stack2);
	else if (operation == op.RR) {
		stack1.rot();
		stack2.rot();
	} else if (operation == op.RRR) {
		stack1.rrot();
		stack2.rrot();
	} else if (operation == op.SS) {
		stack1.swp();
		stack2.swp();
	} else if (operation == op.ROT && Array.isArray(stack1))
		stack1.rot();
	else if (operation == op.RROT && Array.isArray(stack1))
		stack1.rrot();
	else if (operation == op.SWP && Array.isArray(stack1))
		stack1.swp();
	else if (operation == op.PS &&
			Array.isArray(stack1) && Array.isArray(stack2))
		stack1.p(stack2);
}
op.do_string = function(operation, stack1, stack2) {
	let arr = stack2;

	if (operation == "RR") {
		stack1.rot();
		stack2.rot();
	} else if (operation == "RRR") {
		stack1.rrot();
		stack2.rrot();
	} else if (operation == "SS") {
		stack1.swp();
		stack2.swp();
	} else if (operation == "PA")
		stack2.p(stack1);
	else if (operation == "PB")
		stack1.p(stack2);
	else if ("ROT RROT SWP PS".includes(operation) &&
		Array.isArray(stack1)) {
		if (operation == "ROT")
			stack1.rot();
		else if (operation == "RROT")
			stack1.rrot();
		else if (operation == "SWP")
			stack1.swp();
		else if (operation == "PS" && Array.isArray(stack2))
			stack1.p(stack2);
	} else {
		if (operation.includes("A"))
			arr = stack1;
		if (operation.includes("RR"))
			arr.rrot();
		else if (operation.includes("R"))
			arr.rot();
		else if (operation.includes("S"))
			arr.swp();
	}
}
op.do = function(operation, stack1, stack2) {
	if (typeof(operation) == "number")
		op.do_number(operation, stack1, stack2);
	if (typeof(operation) == "string")
		op.do_string(operation, stack1, stack2);
}



function log(text_line) {
	txtArea = getElemById("logArea");

	txtArea.value += text_line + "\r\n";
	txtArea.scrollTop = txtArea.scrollHeight;
}

function logd(text_line) {
	if (push_swap_debug)
		log(text_line);
}

function logs() {
	log(Array.log(a));
	log(Array.log(b));
}

function log_op(operation) {
	if (Array.isArray(operation))
		log_op_array(operation);
	else
		log_op_number_string(operation);
}
function log_op_array(operationArray) {
	let i;

	i = 0;
	while (i < operationArray.length) {
		log_op_number_string(operationArray[i]);
		i++;
	}
}
function log_op_number_string(operation) {
	let opStr = operation;

	txtArea = getElemById("resultingOperationsStack");
	if (txtArea.value != "")
		txtArea.value += " ";
	if (typeof(operation) == "number")
		opStr = op.toStr(operation);
	txtArea.value += opStr;
	txtArea.scrollTop = txtArea.scrollHeight;

	opCount = getElemById("resultingOperationsCount");
	if (opCount.innerHTML != "")
		opCount.innerHTML = parseInt(opCount.innerHTML) + 1;
	else
		opCount.innerHTML = "1";
}

function parseData() {
	let i;
	let arr;
	let num;
	let data;
	let nb_count;

	log("parseData()");
	data = getElemById("inputNumbers").value;
	nb_count = getElemById("inputNumbersCount");
	if (data.length == 0) {
		alert("NO INPUT!");
		return ;
	}
	arr = data.split(" ");
	i = 0;
	while (i < arr.length)
	{
		num = parseInt(arr[i]);
		if (!isNaN(num) && typeof(num) == "number")
			a.push(num);
		i++;
	}
	nb_count.innerHTML = a.length;
	log(Array.log(a));
	log("");
}


function cost_of_raising_nr(target_stack, nbr, insAfter) {
	let i;
	let idx;
	let operation;
	let repeat;

	idx = -1;
	i = 0;
	while (i < target_stack.length) {
		if (target_stack[i] == nbr) {
			idx = i;
			break ;
		}
		i++;
	}
	if (i == target_stack.length && idx == -1)
		return null;
	operation = op.ROT;
	repeat = idx;
	if (insAfter && idx > 0)
		repeat++;
	if (target_stack.length / 2 <= idx) {
		operation = op.RROT;
		logd("calc: len(stack) = " + target_stack.length + " - idx = " + idx);
		repeat = target_stack.length - idx;
		if (insAfter && idx)
			repeat--;
	}
	return {op: operation, rep: repeat};
}

function get_target_idx(target_stack, nbr) {
	let i;
	let sm, bg, val;
	let dist1, dist2;
	let optim;
	let nbr_is_after;

	i = 0;
	sm = target_stack.min();
	dist1 = Math.abs(nbr - sm);
	bg = target_stack.max();
	dist2 = Math.abs(nbr - bg);
	while (i < target_stack.length) {
		val = target_stack[i];
		if (val < nbr) {
			if (nbr - val < dist1) {
				sm = val;
				dist1 = nbr - val;
			}
		}
		if (nbr < val) {
			if (val - nbr < dist2) {
				bg = val;
				dist2 = val - nbr;
			}
		}
		i++;
	}
	nbr_is_after = false;
	if (dist1 <= dist2) {
		optim = target_stack.indexOf(sm);
		if (sm < nbr)
			nbr_is_after = true;
	} else {
		optim = target_stack.indexOf(bg);
		if (bg < nbr)
			nbr_is_after = true;
	}
	//logd(sm + " < (nbr = " + nbr + ") < " + bg + " ==> " + optim);
	return ({idx: optim, insAfterTarget: nbr_is_after});
}

function make_a_ready_for_b_top() {
	log("make_a_ready_for_b_top()");
	target = get_target_idx(a, b.top());
	if (target.idx == a.length - 1) {
		if (a[target.idx] > b.top())
			a.rrot();
	} else if (target.idx == 0) {
		if (a[target.idx] < b.top())
			a.rot();
	} else {
		log("calculating cost for " + a[target.idx] + " insAfterTarget = " + target.insAfterTarget);
		let cost = cost_of_raising_nr(a, a[target.idx], target.insAfterTarget);
		logd("cost.op: " + cost.op + ", repeat: " + cost.rep);
		while (cost.rep--)
			op.do(cost.op, a);
	}
}


function step_1_push_all_to_b() {
	log("step 1: push all to stack b");
	while (a.length > 2)
		a.p(b);
	log(Array.log(a,b));
	log("");
}

function step_2_sort_a() {
	log("step 2: sort stack A (" + a.length + " elements)");
	if (a[0] > a[1])
		a.swp();
	log(Array.log(a,b));
	log("");
}

function step_3_push_all_back_to_a() {
	while (b.length) {
		make_a_ready_for_b_top();
		logd(Array.log(a, b));
		b.p(a);
		logd(Array.log(a, b));
	}
}

function step_4_raise_zero_to_top_in_a() {
	let cost;

	cost = cost_of_raising_nr(a, a.min());
	while (cost.rep--)
		op.do(cost.op, a);
	logd(Array.log(a, b));
}



function push_swap_large_stack() {
	let total_number_count;

	total_number_count = a.length;
	step_1_push_all_to_b();
	step_2_sort_a();
	step_3_push_all_back_to_a(total_number_count);
	step_4_raise_zero_to_top_in_a();
	log("");
	log(Array.log(a,b));
}



function push_swap_small_stack() {
	ps_ss_push_all_to_b();
	step_2_sort_a();
	ps_ss_push_all_back_to_a();
	step_4_raise_zero_to_top_in_a();
	log(Array.log(a, b));
}
function ps_ss_push_all_to_b() {
	if (a.length <= 1)
		return ;
	else if (a.length == 2) {
		if (a[0] > a[1])
			a.swp();
	} else {
		while (a.length > 2)
			a.p(b);
	}
}
function ps_ss_push_all_back_to_a() {
	let i;
	let nr_in_a;
	let nr_in_b;

	i = 0;
	while (b.length) {
		nr_in_a = a.top();
		if (nr_in_a > b.top() && b.top() > a.btm())
			b.p(a);
		else if (nr_in_a > b.btm() && b.btm() > a.btm()) {
			b.rrot();
			b.p(a);
		} else {
			make_a_ready_for_b_top();
			b.p(a);
		}
	}
}

function is_stack_a_sorter() {
	let i;

	i = 0;
	while (i < a.length) {
		if ((i > 0) && (a[i - 1] > a[i]))
			return (false);
		i++;
	}
	return (true);
}

function push_swap() {
	if (a.length > 20)
		push_swap_large_stack();
	else
		push_swap_small_stack();

	log("");
	if (is_stack_a_sorter())
		log("Stack A is now sorted");
	else
		log("ERROR: Stack A IS NOT SORTED PROPERLY!!!");
}




function setup_stacks() {
	a.setName("stack a", "A");
	a.length = 0;
	b.setName("stack b", "B");
	b.length = 0;
	parseData();
}



function reset_input() {
	txtArea = getElemById("inputNumbers");

	txtArea.value = "";
}

function reset_resume(clearValue) {
	txtArea = getElemById("resumeOperationsStack");

	if (clearValue) {
		txtArea.value = "";
		resumeOperations.length = 0;
	}
	txtArea.readOnly = false;
	txtArea.className = "";
}

function reset_operations(keep_array) {
	txtArea = getElemById("resultingOperationsStack");
	opCount = getElemById("resultingOperationsCount");
	
	if (!keep_array)
		operationsStack.length = 0;
	opCount.innerHTML = "";
	txtArea.value = "";
}

function reset_log() {
	txtArea = getElemById("logArea");

	txtArea.value = "";
}

function reset_push_swap() {
	reset_resume(true);
	reset_operations();
	reset_log();
	a.length = 0;
	b.length = 0;
}

function parseOperationsFromResume(into_array) {
	let i;
	let arr;
	let num;
	let accepted_operations;

	log("parseOperationsFromResume()");
	data = getElemById("resumeOperationsStack").value;
	if (data.length == 0) {
		alert("NO INPUT IN THE RESUME!");
		return ;
	}
	arr = data.split(" ");
	accepted_operations = "PA PB RA RB RRA RRB SA SB RR RRR SS";
	i = 0;
	while (i < arr.length)
	{
		if (accepted_operations.includes(arr[i])) {
			into_array.push(arr[i]);
		} else {
			log("ERROR: " + arr[i] +
				" is invalid in the Resume input");
		}
		i++;
	}
	log("parseOperationsFromResume() DONE");
}

function init_resume() {
	let txtArea = getElemById("resumeOperationsStack");

	if (!txtArea.readOnly) {
		parseOperationsFromResume(resumeOperations);
		txtArea.className = "locked";
		txtArea.readOnly = true;
	}
}

function resume_one_step() {
	log("");
	log("resume_one_step()");
	if (resumeOperations.length) {
		let oper = resumeOperations.shift();
		log("Doing " + oper);
		op.do(oper, a, b);
		undoOperations.push(oper);
	}
	if (!resumeOperations.length)
		reset_resume();
	log("");
}

function undo_one_step() {
	log("");
	log("undo_one_step()");
	if (undoOperations.length) {
		let oper = undoOperations.pop();
		resumeOperations.unshift(oper);
		log("UNDOING " + oper + " --> " + op.toStr(opposite[op[oper]]) + " <--");
		op.do(opposite[op[oper]], a, b);
		log(Array.log(a));
		log(Array.log(b));
	} else
		log("undo_one_step(): NO OPERATIONS TO UNDO!");
	log("");
}

function init_push_swap() {
	setup_stacks();
	total_number_count = a.length;
}

function do_push_swap() {
	init_push_swap();
	push_swap();
}


function getElemById(elemIdStr) {
	return (document.getElementById(elemIdStr));
}
function btn_setup(btnId, clickHandlerFunction) {
	getElemById(btnId).addEventListener("click", clickHandlerFunction);
}

window.addEventListener("load", function (e) {
	setup();
	init_push_swap();
});

function setup() {
	btn_setup("btnPushSwapGo", do_push_swap);
	btn_setup("btnPushSwapReset", reset_push_swap);

	btn_setup("btnInputNumbersInit", function() {
		init_push_swap();
	});
	btn_setup("btnInputNumbersClear", reset_input);

	btn_setup("btnResumeOperationsDoAll", function() {
		init_resume();
		while (resumeOperations.length)
			resume_one_step();
		log(Array.log(a));
		log(Array.log(b));
	});
	btn_setup("btnResumeOperationsStepByStepFwd", function() {
		//init_push_swap();
		init_resume();
		resume_one_step();
		log(Array.log(a));
		log(Array.log(b));
	});
	btn_setup("btnResumeOperationsStepByStepBack", function() {
		if (undo_one_step()) {
			log(Array.log(a));
			log(Array.log(b));
		}
	});
	btn_setup("btnResumeOperationsClear", function() {
		reset_resume(true);
	});
	
	btn_setup("btnResultingOperationsReset", reset_operations);

	btn_setup("btnLogStackA", function() {
		log(Array.log(a));
	});
	btn_setup("btnLogStackB", function() {
		log(Array.log(b));
	});
	btn_setup("btnLogAreaClear", reset_log);

	getElemById("logArea").readOnly = true;

	getElemById("inputSize").addEventListener("change", function (e) {
		getElemById("inputNumbers").value = e.target.value;
		reset_push_swap();
		init_push_swap();
	});

	getElemById("body").addEventListener("keydown", function (e) {
		if (e.code == "KeyN")
			getElemById("btnResumeOperationsStepByStepFwd").click();
		else if (e.code == "KeyP")
			getElemById("btnResumeOperationsStepByStepBack").click();
	});
}

export const successResponse = (res:any, msg:string) => {
	var data = {
		status: 1,
		message: msg
	};
	return res.status(200).json(data);
};

export const successResponseWithData = (res:any, msg:string, data:any) => {
	var resData = {
		status: 1,
		message: msg,
		data: data
	};
	return res.status(200).json(resData);
};

export const validationError = (res:any, msg:string) => {
	var resData = {
		status: 0,
		message: msg
	};
	return res.status(400).json(resData);
};


export const validationErrorWithData = (res:any, msg:string, data:any) => {
	var resData = {
		status: 0,
		message: msg,
		data: data
	};
	return res.status(400).json(resData);
};

export const unauthorizedResponse = (res:any, msg:string) => {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(401).json(data);
};

export const notFoundResponse = (res:any, msg:string) => {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(404).json(data);
};

export const errorResponse = (res:any, msg:string) => {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(500).json(data);
};
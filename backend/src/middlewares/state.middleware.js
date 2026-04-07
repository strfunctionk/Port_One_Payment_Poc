export const stateHandler = (req, res, next) => {
  res.success = (result, code = "SUCCESS", message = "요청이 성공적으로 처리되었습니다.") => {
    return res.json({ isSuccess: true, code, message, result });
  };
  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      isSuccess: false,
      code: errorCode,
      message: reason,
      result: data,
    });
  };
  next();
};

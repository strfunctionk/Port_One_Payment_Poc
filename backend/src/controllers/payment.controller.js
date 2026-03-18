import { StatusCodes } from "http-status-codes";
import { bodyToPaymentComplete } from "../dtos/payment.dto.js";
import { completePayment, getMyPayments } from "../services/payment.service.js";

export const handlePaymentComplete = async (req, res, next) => {
  /*
  #swagger.tags = ['Payment']
  #swagger.summary = '결제 완료 처리'
  #swagger.description = '프론트엔드에서 결제 완료 후 결제를 검증하고 저장합니다.'
  #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            paymentId: { type: 'string', example: 'payment_1234567890' },
            orderName: { type: 'string', example: '테스트 상품' },
            amount: { type: 'number', example: 1000 }
          },
          required: ['paymentId', 'orderName', 'amount']
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: '결제 완료 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            resultType: { type: 'string', example: 'SUCCESS' },
            error: { type: 'object', example: null },
            success: {
              type: 'object',
              properties: {
                paymentId: { type: 'string', example: 'payment_1234567890' },
                transactionId: { type: 'string', example: 'tx_1234567890' },
                orderName: { type: 'string', example: '테스트 상품' },
                amount: { type: 'number', example: 1000 },
                status: { type: 'string', example: 'PAID' },
                method: { type: 'string', example: 'CARD' },
                paidAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[400] = {
    description: '결제 검증 실패',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            resultType: { type: 'string', example: 'FAIL' },
            error: {
              type: 'object',
              properties: {
                errorCode: { type: 'string', example: 'payment_verification_failed' },
                reason: { type: 'string', example: '결제 정보를 조회할 수 없습니다.' },
                data: { type: 'object', example: null }
              }
            },
            success: { type: 'object', example: null }
          }
        }
      }
    }
  }
*/
  try {
    const payment = await completePayment(
      bodyToPaymentComplete(req.body),
      req.user.userId
    );
    res.status(StatusCodes.OK).success(payment);
  } catch (err) {
    return next(err);
  }
};

export const handleGetMyPayments = async (req, res, next) => {
  /*
  #swagger.tags = ['Payment']
  #swagger.summary = '내 결제 내역 조회'
  #swagger.description = '로그인한 사용자의 결제 내역을 조회합니다.'

  #swagger.responses[200] = {
    description: '결제 내역 조회 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            resultType: { type: 'string', example: 'SUCCESS' },
            error: { type: 'object', example: null },
            success: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  paymentId: { type: 'string', example: 'payment_1234567890' },
                  transactionId: { type: 'string', example: 'tx_1234567890' },
                  orderName: { type: 'string', example: '테스트 상품' },
                  amount: { type: 'number', example: 1000 },
                  status: { type: 'string', example: 'PAID' },
                  method: { type: 'string', example: 'CARD' },
                  paidAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' }
                }
              }
            }
          }
        }
      }
    }
  }
*/
  try {
    const payments = await getMyPayments(req.user.userId);
    res.status(StatusCodes.OK).success(payments);
  } catch (err) {
    return next(err);
  }
};

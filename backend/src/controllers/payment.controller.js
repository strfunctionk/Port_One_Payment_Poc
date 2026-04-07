import { StatusCodes } from "http-status-codes";
import { bodyToPaymentComplete } from "../dtos/payment.dto.js";
import {
  completePayment,
  getMyPayments,
  getChannelKey,
  cancelPayment,
} from "../services/payment.service.js";

export const handleGetChannelKey = async (req, res) => {
  /*
  #swagger.tags = ['Payment']
  #swagger.summary = '채널키 조회'
  #swagger.description = 'PG사에 해당하는 PortOne 채널키를 조회합니다.'

  #swagger.parameters['pg'] = {
    in: 'query',
    required: true,
    schema: { type: 'string', enum: ['NHN_KCP', 'KG_INICIS', 'KAKAOPAY'], example: 'NHN_KCP' },
    description: 'PG사 코드'
  }

  #swagger.responses[200] = {
    description: '채널키 조회 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            isSuccess: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SUCCESS' },
            message: { type: 'string', example: '요청이 성공적으로 처리되었습니다.' },
            result: {
              type: 'object',
              properties: {
                pgProvider: { type: 'string', example: 'NHN_KCP' },
                channelKey: { type: 'string', example: 'channel-key-xxx' }
              }
            }
          }
        }
      }
    }
  }
  */
  const { pg } = req.query;
  const result = getChannelKey(pg);
  res.status(StatusCodes.OK).success(result);
};

export const handlePaymentComplete = async (req, res) => {
  /*
  #swagger.tags = ['Payment']
  #swagger.summary = '결제 완료 처리'
  #swagger.description = '프론트엔드에서 결제 완료 후 PortOne에서 검증하고 저장합니다.'
  #swagger.security = [{ bearerAuth: [] }]

  #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['paymentId', 'orderName', 'amount'],
          properties: {
            paymentId: { type: 'string', example: 'payment_1234567890' },
            orderName: { type: 'string', example: '리포트 생성권 1개 x1' },
            amount: { type: 'number', example: 4900 },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ticketProductId: { type: 'number', example: 1 },
                  quantity: { type: 'number', example: 1 }
                }
              }
            }
          }
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
            isSuccess: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SUCCESS' },
            message: { type: 'string', example: '요청이 성공적으로 처리되었습니다.' },
            result: {
              type: 'object',
              properties: {
                paymentId: { type: 'string', example: 'payment_1234567890' },
                orderName: { type: 'string', example: '리포트 생성권 1개 x1' },
                amount: { type: 'number', example: 4900 },
                currency: { type: 'string', example: 'KRW' },
                createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                transactions: { type: 'array', items: { type: 'object' } }
              }
            }
          }
        }
      }
    }
  }
  */
  const payment = await completePayment(
    bodyToPaymentComplete(req.body),
    req.user.userId
  );
  res.status(StatusCodes.OK).success(payment);
};

export const handleGetMyPayments = async (req, res) => {
  /*
  #swagger.tags = ['Payment']
  #swagger.summary = '내 결제 내역 조회'
  #swagger.description = '로그인한 사용자의 결제 내역을 조회합니다.'
  #swagger.security = [{ bearerAuth: [] }]

  #swagger.responses[200] = {
    description: '결제 내역 조회 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            isSuccess: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SUCCESS' },
            message: { type: 'string', example: '요청이 성공적으로 처리되었습니다.' },
            result: {
              type: 'object',
              properties: {
                payments: { type: 'array', items: { type: 'object' } }
              }
            }
          }
        }
      }
    }
  }
  */
  const payments = await getMyPayments(req.user.userId);
  res.status(StatusCodes.OK).success({ payments });
};

export const handlePaymentCancel = async (req, res) => {
  /*
  #swagger.tags = ['Payment']
  #swagger.summary = '결제 취소'
  #swagger.description = '완료된 결제를 취소합니다.'
  #swagger.security = [{ bearerAuth: [] }]

  #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['reason'],
          properties: {
            reason: { type: 'string', example: '단순 변심' }
          }
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: '취소 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            isSuccess: { type: 'boolean', example: true },
            code: { type: 'string', example: 'SUCCESS' },
            message: { type: 'string', example: '요청이 성공적으로 처리되었습니다.' },
            result: { type: 'object' }
          }
        }
      }
    }
  }
  */
  const { paymentId } = req.params;
  const { reason } = req.body;
  const payment = await cancelPayment(paymentId, reason, req.user.userId);
  res.status(StatusCodes.OK).success(payment);
};

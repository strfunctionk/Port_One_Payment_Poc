import { StatusCodes } from "http-status-codes";
import { getTicketProducts, getMyCredits } from "../services/ticket.service.js";

export const handleGetTicketProducts = async (req, res) => {
  /*
  #swagger.tags = ['Ticket']
  #swagger.summary = '티켓 상품 목록 조회'
  #swagger.description = '판매 중인 티켓 상품 목록을 조회합니다.'

  #swagger.responses[200] = {
    description: '조회 성공',
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
                products: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 1 },
                      name: { type: 'string', example: '리포트 생성권 1개' },
                      price: { type: 'number', example: 4900 },
                      creditAmount: { type: 'number', example: 1 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  */
  const products = await getTicketProducts();
  res.status(StatusCodes.OK).success({ products });
};

export const handleGetMyCredits = async (req, res) => {
  /*
  #swagger.tags = ['Ticket']
  #swagger.summary = '잔여 크레딧 조회'
  #swagger.description = '로그인한 사용자의 잔여 리포트 생성권 수량을 조회합니다.'
  #swagger.security = [{ bearerAuth: [] }]

  #swagger.responses[200] = {
    description: '조회 성공',
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
                remainingCount: { type: 'number', example: 3 }
              }
            }
          }
        }
      }
    }
  }
  */
  const credit = await getMyCredits(req.user.userId);
  res.status(StatusCodes.OK).success(credit);
};

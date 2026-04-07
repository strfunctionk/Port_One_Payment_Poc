import { StatusCodes } from "http-status-codes";
import { userProfile } from "../services/user.service.js";

export const handleUserProfile = async (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = '유저 프로필 조회'
    #swagger.description = '유저 프로필 조회를 위한 API입니다.'

    #swagger.responses[200] = {
      description: '유저 프로필 조회 성공',
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
                  userId: { type: 'number', example: 1 },
                  email: { type: 'string', example: 'email@email.com' },
                  name: { type: 'string', example: '이름' },
                  username: { type: 'string', example: 'username' },
                  avatar: { type: 'string', example: 'avatar.png' },
                  createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
                  updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[401] = {
      description: 'Access Token이 없습니다',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              isSuccess: { type: 'boolean', example: false },
              code: { type: 'string', example: 'unauthorized' },
              message: { type: 'string', example: 'Access Token이 없습니다.' },
              result: { type: 'object', example: null }
            }
          }
        }
      }
    }

    #swagger.responses[403] = {
      description: '토큰 형식이 올바르지 않습니다',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              isSuccess: { type: 'boolean', example: false },
              code: { type: 'string', example: 'not_access_token' },
              message: { type: 'string', example: 'Access Token 형식이 올바르지 않거나 유효하지 않습니다.' },
              result: { type: 'object', example: null }
            }
          }
        }
      }
    }

    #swagger.responses[419] = {
      description: '토큰이 만료 되었습니다',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              isSuccess: { type: 'boolean', example: false },
              code: { type: 'string', example: 'expired_access_token' },
              message: { type: 'string', example: 'Access Token이 만료되었습니다.' },
              result: { type: 'object', example: null }
            }
          }
        }
      }
    }
*/

  const user = await userProfile(req.user.userId);
  res.status(StatusCodes.OK).success(user);
};

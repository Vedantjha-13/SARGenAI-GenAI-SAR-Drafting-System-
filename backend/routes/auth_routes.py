from __future__ import annotations

from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, status

fromauth.rbac import get_current_user
fromauth.token_service import TokenService
fromconfig import get_settings
fromdb.connection import mongo_manager
frommodels.user_model import UserModel
fromschemas.request_schemas import LoginRequest
fromschemas.response_schemas import AuthTokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


def _to_user_response(user: UserModel) -> UserResponse:
    return UserResponse(
        id=user.id or "",
        email=user.email,
        name=user.name,
        role=user.role,
        oauth_provider=user.oauth_provider,
        profile_picture=user.profile_picture,
        last_login=user.last_login,
    )


@router.post("/login", response_model=AuthTokenResponse, status_code=status.HTTP_200_OK)
async def login(payload: LoginRequest) -> AuthTokenResponse:
    now = datetime.utcnow()
    oauth_id = payload.oauth_id or f"{payload.provider}:{payload.email}"
    existing = await mongo_manager.users.find_one(
        {
            "$or": [
                {"oauth_id": oauth_id},
                {"email": payload.email},
            ]
        }
    )

    if existing:
        user = UserModel.from_mongo(existing)
        user.name = payload.name
        user.role = payload.role
        user.oauth_provider = payload.provider
        user.oauth_id = oauth_id
        user.last_login = now
        user.updated_at = now
        await mongo_manager.users.update_one(
            {"_id": ObjectId(user.id)},
            {
                "$set": {
                    "name": user.name,
                    "role": user.role.value,
                    "oauth_provider": user.oauth_provider,
                    "oauth_id": user.oauth_id,
                    "last_login": user.last_login,
                    "updated_at": user.updated_at,
                }
            },
        )
    else:
        user = UserModel(
            oauth_provider=payload.provider,
            oauth_id=oauth_id,
            email=payload.email,
            name=payload.name,
            role=payload.role,
            last_login=now,
            created_at=now,
            updated_at=now,
        )
        inserted = await mongo_manager.users.insert_one(user.to_mongo())
        user.id = str(inserted.inserted_id)

    token_service = TokenService(get_settings())
    access_token, expires_in = token_service.create_access_token(user)
    return AuthTokenResponse(
        access_token=access_token,
        expires_in=expires_in,
        user=_to_user_response(user),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserModel = Depends(get_current_user)) -> UserResponse:
    return _to_user_response(current_user)

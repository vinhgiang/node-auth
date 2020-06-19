# Node JS Plain Authentication
In this demo, I created a simple authenticate application without using 3rd party authentication library like Passport.
By doing this, I can have a deeper understanding of how things work behind the scenes, including hashing passport,
JWT encoding and decoding.

This is an API based application, no interface, you will need to use some forms of API calling like Post Man to run through the application.
You also need to create a MongoDB database for storing user info.

## Dependencies
1. bcrypt
1. config
1. dotenv
1. express
1. jsonwebtoken
1. mongoose

## APIs
1. ### Registration
    `POST: http://localhost:3000/users/`
    
    Params:
        
        . first_name
        . last_name
        . email
        . password
    
    Response:
    
        . code: 422
            { "error": "This email address has been taken." }
            
        . code: 200
            { "message": "Your account has been created successfully." }
    
1. ### Login
    `POST: http://localhost:3000/users/login`
    
    Params:
        
        . email
        . password
        
    Response:
    
        . code: 200
            {
                "message": "You have successfully logged in.",
                "token": "xxxxx",
                "refresh_token": "xxxx"
            }
            
        . code 400
            { "error": "Your email or password is not match." }
            
    **token**: JWT token, indicate that you have been authenticated successfully. 
    This token also need for further requests which require authentication.
    It will have an expiration time defined in config/default.json, jwt_lifetime.
    
    **refresh_token**: JWT token, used for renew a token in case that token has been expired and also
    could apply as a log out everywhere feature.
    
1. ### Profile (Protected route)
    `GET http://localhost:3000/users`
    
    Header:
        
        . Authorization: Bearer {token}
    
    Params:
        
        . NONE
        
    Response:
    
        . Code 403 Forbidden
        
        . Code 200
            {
                "_id": "5ee45e24378a933143b23b35",
                "first_name": "Vinh",
                "last_name": "Giang",
                "email": "giangcamvinh@gmail.com",
                "created_at": "2020-06-13T05:03:32.510Z",
                "updated_at": "2020-06-19T00:35:45.692Z",
                "refresh_token": "xxx"
            }
            
1. ### Refresh token (Protected route)
    `POST http://localhost:3000/users/token`
        
    Params:
            
        . token: {refresh_token} 
        
    Response:
        
        . Code 403 Forbidden
        
        . Code 200
            { "token": "xxx" }
            
    **token**: Use this token to keep user logged in
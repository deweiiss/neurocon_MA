import secrets


class Session:

    @staticmethod
    def generateToken():
        return secrets.token_urlsafe(16)

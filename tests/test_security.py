import unittest
from unittest.mock import Mock, patch
from backend.app.config import Settings
from backend.app.seed import ensure_admin
from backend.app.routers.auth import register
from backend.app.schemas import AuthRequest
from fastapi import HTTPException

class DeploymentSecurityTests(unittest.TestCase):
    def settings(self, **kw):
        return Settings(_env_file=None, **kw)

    def test_production_rejects_defaults(self):
        with self.assertRaises(ValueError):
            self.settings().validate_deployment()

    def test_production_rejects_weak_password_and_null_origin(self):
        for kw in [dict(admin_password='123456'), dict(admin_password='a-private-admin-password', cors_origins='null'), dict(admin_password='a-private-admin-password', cors_origins='file://localhost'), dict(admin_password=' '*12)]:
            with self.assertRaises(ValueError):
                self.settings(jwt_secret='x'*48, **kw).validate_deployment()

    def test_demo_and_explicit_production(self):
        self.settings(app_env='demo').validate_deployment()
        self.settings(jwt_secret='x'*48, admin_password='a-private-admin-password').validate_deployment()

    def test_existing_demo_admin_blocks_production(self):
        settings=self.settings(jwt_secret='x'*48, admin_password='a-private-admin-password')
        db=Mock()
        with patch('backend.app.seed.get_settings',return_value=settings), patch('backend.app.seed.verify_password',return_value=True):
            with self.assertRaises(ValueError):
                ensure_admin(db)

    def test_registration_rejects_html_and_long_names_before_db_access(self):
        for username in ['<img onerror=alert(1)>', 'a'*33]:
            db=Mock()
            with self.assertRaises(HTTPException) as failure:
                register(AuthRequest(username=username,password='abc12345'),db)
            self.assertEqual(failure.exception.status_code,400)
            db.query.assert_not_called()

if __name__ == '__main__':
    unittest.main()

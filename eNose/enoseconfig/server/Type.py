from enum import Enum


class SensorStatus(Enum):
    UNAVAILABLE = 0
    DISABLED = 1
    INACTIVE = 2
    ACTIVE = 3


class SensorType(Enum):
    GAS = 1
    TEMPERATURE = 2
    HUMIDITY = 3


class UserType(Enum):
    SYSTEM = 0
    ADMIN = 1
    OPERATOR = 2

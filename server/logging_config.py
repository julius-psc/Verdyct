
import logging
import traceback

# Setup logging
logging.basicConfig(
    filename='server_errors.log',
    level=logging.ERROR,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ... existing code ...

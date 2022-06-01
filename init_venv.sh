#!/bin/sh

VENV_DIR="venv"


# setup venv
python3.10 -m venv $VENV_DIR
source $VENV_DIR/bin/activate

pip install -r requirements.txt

import os, subprocess, sys


def linkFolder(link: str, src: str):
    if not os.path.isdir(src) or os.path.isdir(link):
        return
    os.makedirs(os.path.dirname(link), exist_ok=True)
    subprocess.run(
        ['cmd', '/c', 'mklink', '/J', os.path.abspath(link),
         os.path.abspath(src)],
        shell=True,
    )


SRC_ROOT = os.path.dirname(__file__)
SRC_TARGETS = ['server_scripts', 'startup_scripts', 'client_scripts']
SRC_TARGETS_SEP = ['assets/magic_pot']
TYPE_TARGETS = ['probe']
MC_ROOT = r'C:/Minecraft/.minecraft/versions'
BASE_DIR = sys.argv[1] if len(sys.argv) > 1 else 'playground'
LINK_NAME = 'magic_pot'

if (sub := BASE_DIR):
    kjsPath = os.path.join(MC_ROOT, sub, 'kubejs')
    if not os.path.isdir(kjsPath):
        exit()
    for t in TYPE_TARGETS:
        linkFolder(
            os.path.join(SRC_ROOT, t),
            os.path.join(kjsPath, t),
        )
    for t in SRC_TARGETS:
        linkFolder(
            os.path.join(kjsPath, t, LINK_NAME),
            os.path.join(SRC_ROOT, t),
        )
    for t in SRC_TARGETS_SEP:
        linkFolder(
            os.path.join(kjsPath, t),
            os.path.join(SRC_ROOT, t),
        )

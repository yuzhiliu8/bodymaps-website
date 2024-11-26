

class Utils:
    @classmethod
    def removeFileExt(cls, filename):
        return filename[:filename.index('.')]
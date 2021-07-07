using System;

namespace game
{
    public class CSharpUtils
    {
        public static String _io_path_GetDirectoryName(String path)
        {
            return System.IO.Path.GetDirectoryName(path);
        }

        public static String _io_path_Combine(String path1, String path2)
        {
            return System.IO.Path.Combine(path1, path2);
        }

        public static bool _io_file_Exists(String path)
        {
            return System.IO.File.Exists(path);
        }

        public static String _io_file_ReadAllText(String path)
        {
            return System.IO.File.ReadAllText(path);
        }
    }
}

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

public class RemoveLombok {

    public static void main(String[] args) throws Exception {
        Path srcDir = Paths.get("src/main/java");
        Files.walk(srcDir)
            .filter(path -> path.toString().endsWith(".java"))
            .forEach(RemoveLombok::processFile);
        System.out.println("Lombok removed successfully.");
    }

    private static void processFile(Path path) {
        try {
            String content = new String(Files.readAllBytes(path));
            boolean needsProcessing = content.contains("@Data") || content.contains("@RequiredArgsConstructor");
            
            // Handle cases where we partially removed it but missed some methods
            if (!needsProcessing && !content.contains("import lombok")) {
                // If it already doesn't have lombok, we still might need to add missing getters/setters if it's a model
                if (!path.toString().contains("model") && !path.toString().contains("service")) return;
                if (content.contains("public void set")) {
                    // Already processed partially, but let's re-run to catch missed fields
                } else if (!content.contains("private ")) {
                    return; // No fields
                }
            }

            content = content.replaceAll("import lombok\\..*;\r?\n", "");
            content = content.replace("@Data\n", "").replace("@Data\r\n", "");
            content = content.replace("@RequiredArgsConstructor\n", "").replace("@RequiredArgsConstructor\r\n", "");
            content = content.replaceAll("@Data\\s+", "");
            content = content.replaceAll("@RequiredArgsConstructor\\s+", "");

            Matcher classMatcher = Pattern.compile("public class (\\w+)").matcher(content);
            if (!classMatcher.find()) return;
            String className = classMatcher.group(1);

            List<String[]> fields = new ArrayList<>();
            List<String[]> finalFields = new ArrayList<>();
            
            Matcher fieldMatcher = Pattern.compile("private\\s+(final\\s+)?([\\w<>\\[\\]\\?]+)\\s+(\\w+)(?:\\s*=[^;]+)?\\s*;").matcher(content);
            while (fieldMatcher.find()) {
                boolean isFinal = fieldMatcher.group(1) != null;
                String type = fieldMatcher.group(2);
                String name = fieldMatcher.group(3);
                fields.add(new String[]{type, name});
                if (isFinal) finalFields.add(new String[]{type, name});
            }

            StringBuilder addition = new StringBuilder("\n");

            if (!content.contains(className + "(")) {
                if (finalFields.size() > 0) {
                    addition.append("    public ").append(className).append("(");
                    for (int i = 0; i < finalFields.size(); i++) {
                        addition.append(finalFields.get(i)[0]).append(" ").append(finalFields.get(i)[1]);
                        if (i < finalFields.size() - 1) addition.append(", ");
                    }
                    addition.append(") {\n");
                    for (String[] ff : finalFields) {
                        addition.append("        this.").append(ff[1]).append(" = ").append(ff[1]).append(";\n");
                    }
                    addition.append("    }\n\n");
                }
                
                if (fields.size() > 0 && finalFields.isEmpty() && !content.contains("public " + className + "()")) {
                    addition.append("    public ").append(className).append("() {}\n\n");
                }
            }

            if (fields.size() > 0) {
                for (String[] f : fields) {
                    String type = f[0];
                    String name = f[1];
                    String capName = name.substring(0, 1).toUpperCase() + name.substring(1);
                    String getterPrefix = type.equalsIgnoreCase("boolean") || type.equalsIgnoreCase("Boolean") ? "get" : "get";
                    if (type.equalsIgnoreCase("boolean")) getterPrefix = "is";
                    // For Boolean wrapper, sometimes people use get, sometimes is. Let's provide get.
                    // If field name starts with "is", e.g. "isAsap", the getter might just be getIsAsap() or isAsap()
                    
                    if (!content.contains(" " + getterPrefix + capName + "()")) {
                        addition.append("    public ").append(type).append(" ").append(getterPrefix).append(capName).append("() {\n");
                        addition.append("        return this.").append(name).append(";\n");
                        addition.append("    }\n\n");
                    }
                    if (!content.contains(" set" + capName + "(")) {
                        addition.append("    public void set").append(capName).append("(").append(type).append(" ").append(name).append(") {\n");
                        addition.append("        this.").append(name).append(" = ").append(name).append(";\n");
                        addition.append("    }\n\n");
                    }
                }
            }

            int lastBrace = content.lastIndexOf('}');
            if (lastBrace != -1 && addition.length() > 5) {
                content = content.substring(0, lastBrace) + addition.toString() + content.substring(lastBrace);
                Files.write(path, content.getBytes());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

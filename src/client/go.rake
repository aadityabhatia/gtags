
namespace :client do

    jsfTasks = []
    jsfs = FileList['src/client/**/*.js']

    jsfOutputDir = "out/public/js"
    jsfs.each do |f|
        destFile = jsfOutputDir + "/" + f.sub("src/client/", "")
        file destFile => [f] do
            mkdir_p File.dirname(destFile)
            FileUtils.cp f, destFile
        end
        jsfTasks.push(destFile)
    end

    htmTasks = []
    htms = FileList['src/client/**/*.html']

    htmOutputDir = "out/public/html"
    htms.each do |f|
        destFile = htmOutputDir + "/" + f.sub("src/client/", "")
        file destFile => [f] do
            mkdir_p File.dirname(destFile)
            FileUtils.cp f, destFile
        end
        htmTasks.push(destFile)
    end

    task :jsfs => jsfTasks
    task :htms => htmTasks
    task :do => [:jsfs, :htms]
end



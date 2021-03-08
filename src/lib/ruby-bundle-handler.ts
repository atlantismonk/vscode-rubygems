import * as child_process from 'child_process';
import { join } from 'path';
import { DefineFile } from '../shared/constant';
import { global } from '../global';

export class RubyBundleHandler{

  constructor(
  ){}

  
  static async exec(prjPath: string): Promise<any[]> {
    const gemfile = join(prjPath, DefineFile.Gemfile);
    const lockfile = join(prjPath, DefineFile.Lockfile);
    const converter = global.context.asAbsolutePath('h11s/lockfile_converter.rb');

    return new Promise((resolve, reject) => {
      child_process.exec(
        `bundle exec ${converter} ${gemfile} ${lockfile}`,
        {
          cwd: prjPath,
          windowsHide: true,
          maxBuffer: 1024 * 1024 * 10
        },
        (err: any, stdout: string | Buffer, stderr: string | Buffer) => {
          if (err) return reject(err);
          if (stderr) return reject(stderr);

          try {
            const data = JSON.parse(stdout.toString());
            resolve(data);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }
}
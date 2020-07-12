//THİS İS MAİN FİLE

const discord = require("discord.js")
const client = new discord.Client()

const { TOKEN, PREFIX } = require("./config.json")
const Captcha = require("haileybot/captcha-generator")

client.on("ready", () => {
    console.log("MY NAME " + client.user.username + "\n" + "MY PREFIX " + PREFIX)
  })

  client.on("guildMemberAdd", async (member) => {
    let captcha = new Captcha()
    
    
    const channel = member.guild.channels.cache.find((x) => x.name === "verify")
    
    if(!channel) {
     return console.log(member.guild.name + " Please Create channel with name verify")
    }
    
    const vrole = member.guild.roles.cache.find((x) => x.name === "non-verified")
    
      if(!vrole) {
     return console.log(member.guild.name + " Please Create role with name 'non-verified'")
    }
    
    member.roles.add(vrole)
    const verifycode = await channel.send("Please Type The Given Code For Verification",
                 new discord.MessageAttachment(captcha.PNGStream, "captcha.png")
    )

    let collector = channel.createMessageCollector(
        m => m.author.id === member.id
        )

    collector.on("collect", m => {
        if(m.content.toUpperCase() === captcha.value) {
            m.delete()
            verifycode.delete()
            member.roles.remove(vrole)
          return member.send("NOW YOU ARE VERIFIED MEMBER :)")
        } else if(m.content.toUpperCase() !== captcha.value) {
            m.delete()
            verifycode.delete()

            member.send("You gave wrong code, so you can apply again by joining server again")
            
            setTimeout(function() {
                member.kick()

            }, 3000)
        
        } else {
            verifycode.delete()
        }
})


})

client.login(TOKEN)